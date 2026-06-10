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
} from "../controllers/adminController.js";

const router =
  express.Router();

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

export default router;