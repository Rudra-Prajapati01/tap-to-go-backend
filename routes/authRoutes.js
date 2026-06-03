import express from "express";

import {

  registerUser,

  loginUser,

  googleLogin,

  updateProfile,

  getUserById,

} from "../controllers/authController.js";

const router = express.Router();

// REGISTER
router.post(
  "/register",
  registerUser
);

// LOGIN
router.post(
  "/login",
  loginUser
);

// GOOGLE LOGIN
router.post(
  "/google-login",
  googleLogin
);

// GET USER BY ID
router.get(
  "/user/:id",
  getUserById
);

// UPDATE PROFILE
router.put(
  "/update-profile/:id",
  updateProfile
);

export default router;