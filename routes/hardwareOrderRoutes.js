import express from "express";

import {
  createHardwareRazorpayOrder,
  verifyHardwareRazorpayPayment,
} from "../controllers/hardwareOrderController.js";

const router = express.Router();


// CREATE RAZORPAY ORDER FOR A FIXED JIOTAP HARDWARE PRODUCT
router.post(
  "/razorpay",
  createHardwareRazorpayOrder
);


// VERIFY PAYMENT SIGNATURE & MARK ORDER AS PAID
router.post(
  "/verify",
  verifyHardwareRazorpayPayment
);

export default router;