import Razorpay from "razorpay";
import crypto from "crypto";

import Order from "../models/Order.js";
import Product from "../models/Product.js";

// ── Razorpay instance ────────────────────────────────────────────────────────
// Requires the following environment variables to be set on the server:
//   RAZORPAY_KEY_ID
//   RAZORPAY_KEY_SECRET
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ── CREATE RAZORPAY ORDER ─────────────────────────────────────────────────────
// POST /api/orders/razorpay
// body: { userId, items: [{ productId, quantity }], customerName, customerEmail, customerPhone }
//
// Recalculates the total from the DB (never trusts amounts sent by the client),
// creates a Razorpay order, and stores a "created" Order record in MongoDB.
export const createRazorpayOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      customerName,
      customerEmail,
      customerPhone,
    } = req.body;

    if (!userId || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "userId and a non-empty items array are required.",
      });
    }

    if (!customerName || !customerEmail || !customerPhone) {
      return res.status(400).json({
        message: "customerName, customerEmail and customerPhone are required.",
      });
    }

    // Fetch all referenced products belonging to this seller in one query
    const productIds = items.map((item) => item.productId);

    const products = await Product.find({
      _id: { $in: productIds },
      userId,
    });

    if (products.length === 0) {
      return res.status(404).json({
        message: "No matching products found for this seller.",
      });
    }

    const productMap = new Map(
      products.map((p) => [p._id.toString(), p])
    );

    let totalAmount = 0;
    const orderProducts = [];

    for (const item of items) {
      const product = productMap.get(String(item.productId));
      const quantity = Number(item.quantity) || 0;

      if (!product) {
        return res.status(404).json({
          message: `Product not found: ${item.productId}`,
        });
      }

      if (quantity < 1) {
        return res.status(400).json({
          message: `Invalid quantity for product: ${product.name}`,
        });
      }

      const unitPrice = Number(product.price) || 0;
      const lineTotal = unitPrice * quantity;
      totalAmount += lineTotal;

      orderProducts.push({
        productId: product._id,
        name: product.name,
        image: product.image || "",
        price: unitPrice,
        currency: product.currency || "₹",
        quantity,
        total: lineTotal,
      });
    }

    if (totalAmount <= 0) {
      return res.status(400).json({
        message: "Order total must be greater than zero.",
      });
    }

    // Razorpay expects the amount in the smallest currency unit (paise for INR)
    const amountInPaise = Math.round(totalAmount * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: String(userId),
        customerName,
        customerEmail,
        customerPhone,
      },
    });

    const order = await Order.create({
      userId,
      customerName,
      customerEmail,
      customerPhone,
      products: orderProducts,
      totalAmount,
      currency: "INR",
      razorpayOrderId: razorpayOrder.id,
      paymentStatus: "created",
    });

    res.status(201).json({
      orderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create Razorpay order",
      error: err.message,
    });
  }
};


// ── VERIFY PAYMENT & SAVE ORDER ───────────────────────────────────────────────
// POST /api/orders/verify
// body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
//
// Verifies the HMAC SHA256 signature returned by Razorpay Checkout against the
// key secret. On success, marks the matching Order as "paid" and returns it.
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        message:
          "razorpay_order_id, razorpay_payment_id and razorpay_signature are required.",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      await Order.findOneAndUpdate(
        { razorpayOrderId: razorpay_order_id },
        { paymentStatus: "failed" }
      );

      return res.status(400).json({
        success: false,
        message: "Payment verification failed. Invalid signature.",
      });
    }

    const order = await Order.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentStatus: "paid",
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found for this Razorpay order id.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Payment verified successfully.",
      order,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to verify payment",
      error: err.message,
    });
  }
};


// ── GET SINGLE ORDER ───────────────────────────────────────────────────────────
// GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch order",
      error: err.message,
    });
  }
};


// ── GET ORDERS FOR A SELLER ───────────────────────────────────────────────────
// GET /api/orders/user/:userId
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      userId: req.params.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch orders",
      error: err.message,
    });
  }
};