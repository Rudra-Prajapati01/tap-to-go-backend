import express from "express";

import {
  createRazorpayOrder,
  verifyRazorpayPayment,
  getOrderById,
  getUserOrders,
} from "../controllers/orderController.js";

const router = express.Router();


// CREATE RAZORPAY ORDER (cart → checkout)
router.post(
  "/razorpay",
  createRazorpayOrder
);


// VERIFY PAYMENT SIGNATURE & MARK ORDER AS PAID
router.post(
  "/verify",
  verifyRazorpayPayment
);


// GET ORDERS FOR A SELLER
router.get(
  "/user/:userId",
  getUserOrders
);


// GET SINGLE ORDER
router.get(
  "/:id",
  getOrderById
);

export default router;