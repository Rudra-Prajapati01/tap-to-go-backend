import Razorpay from "razorpay";
import crypto from "crypto";

import Order from "../models/Order.js";

// ── Razorpay instance ────────────────────────────────────────────────────────
// Requires RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET in env (same as orderController.js)
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ── Fixed price map ───────────────────────────────────────────────────────────
// Server-side source of truth for JioTap's own hardware lineup.
// Keep these ids in sync with `initialProducts` in Products.jsx.
// Prices are in INR (rupees) — converted to paise when creating the Razorpay order.
const HARDWARE_PRODUCTS = {
    jiolight: {
        name: "JioTap Light Card",
        price: 799,
        image: "/cards/jiolight/lightcard.png",
    },
    jiotapprim: {
        name: "Premium Custom Card",
        price: 1499,
        image: "/cards/jiotapprim/premiumcard.png",
    },
    jiotapgooglereview: {
        name: "JioTap Google Review Card",
        price: 1299,
        image: "/cards/jiotapgooglereview/googlereviewcard1.png",
    },
};

// JioTap's own "seller" id, used to attribute these hardware orders in the
// shared Order collection. Replace with the real JioTap admin/business user id.
const JIOTAP_SELLER_ID = process.env.JIOTAP_SELLER_USER_ID || "000000000000000000000000";


// ── CREATE RAZORPAY ORDER FOR HARDWARE PRODUCT ────────────────────────────────
// POST /api/hardware-orders/razorpay
// body: { productId, quantity, customerName, customerEmail, customerPhone }
//
// productId must be one of: "jiolight" | "jiotapprim" | "jiotapgooglereview"
export const createHardwareRazorpayOrder = async (req, res) => {
    try {
        const {
            productId,
            quantity,
            customerName,
            customerEmail,
            customerPhone,
        } = req.body;

        const product = HARDWARE_PRODUCTS[productId];

        if (!product) {
            return res.status(400).json({
                message: "Invalid product. Must be one of: " + Object.keys(HARDWARE_PRODUCTS).join(", "),
            });
        }

        const qty = Number(quantity) || 0;
        if (qty < 1) {
            return res.status(400).json({
                message: "Quantity must be at least 1.",
            });
        }

        if (!customerName || !customerEmail || !customerPhone) {
            return res.status(400).json({
                message: "customerName, customerEmail and customerPhone are required.",
            });
        }

        const lineTotal = product.price * qty;
        const amountInPaise = Math.round(lineTotal * 100);

        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: "INR",
            receipt: `hw_receipt_${Date.now()}`,
            notes: {
                productId,
                customerName,
                customerEmail,
                customerPhone,
            },
        });

        const order = await Order.create({
            userId: JIOTAP_SELLER_ID,
            customerName,
            customerEmail,
            customerPhone,
            products: [
                {
                    // productId here references the fixed hardware catalog, not a Mongo Product._id,
                    // so we generate a stable placeholder ObjectId-shaped value via hashing.
                    productId: hashToObjectId(productId),
                    name: product.name,
                    image: product.image,
                    price: product.price,
                    currency: "₹",
                    quantity: qty,
                    total: lineTotal,
                },
            ],
            totalAmount: lineTotal,
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
// POST /api/hardware-orders/verify
// body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
// Identical verification logic to orderController.verifyRazorpayPayment —
// kept separate so this module has no dependency on the seller order flow.
export const verifyHardwareRazorpayPayment = async (req, res) => {
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

        if (expectedSignature !== razorpay_signature) {
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
                orderStatus: "confirmed",
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

// ── Helper: deterministic 24-hex-char id from a string (so the schema's
// ObjectId field accepts our fixed catalog ids without a real Product doc) ──
function hashToObjectId(str) {
    const hash = crypto.createHash("md5").update(str).digest("hex");
    return hash.slice(0, 24);
}