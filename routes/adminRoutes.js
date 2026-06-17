import express from "express";

import {
  adminLogin,
  getDashboardStats,
  getAllUsers,
  getUserById,
  deleteUser,
  activateCard,
  deactivateCard,
  getAllLeads,
  updateUserByAdmin,
  forgotPassword,
  verifyOTP,
  resetPassword,

  // Orders
  getAllOrders,
  getOrderByIdAdmin,
  updateOrderStatus,

} from "../controllers/adminController.js";

const router = express.Router();

/* ==========================
   ADMIN LOGIN
========================== */

router.post(
  "/login",
  adminLogin
);

/* ==========================
   DASHBOARD
========================== */

router.get(
  "/dashboard",
  getDashboardStats
);

/* ==========================
   USERS
========================== */

router.get(
  "/users",
  getAllUsers
);

router.get(
  "/users/:id",
  getUserById
);

router.delete(
  "/users/:id",
  deleteUser
);

router.put(
  "/users/:id",
  updateUserByAdmin
);

/* ==========================
   CARD MANAGEMENT
========================== */

router.put(
  "/activate/:id",
  activateCard
);

router.put(
  "/deactivate/:id",
  deactivateCard
);

/* ==========================
   PASSWORD RESET
========================== */

router.post(
  "/forgot-password",
  forgotPassword
);

router.post(
  "/verify-otp",
  verifyOTP
);

router.post(
  "/reset-password",
  resetPassword
);

/* ==========================
   LEADS
========================== */

router.get(
  "/leads",
  getAllLeads
);

/* ==========================
   ORDERS
========================== */

router.get(
  "/orders",
  getAllOrders
);

router.get(
  "/orders/:id",
  getOrderByIdAdmin
);

router.put(
  "/orders/:id/status",
  updateOrderStatus
);

export default router;