import express from "express";

import {

  registerUser,

  loginUser,

  googleLogin,

  updateProfile,

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

// UPDATE PROFILE
router.put(
  "/update-profile/:id",
  updateProfile
);

export default router;