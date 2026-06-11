import express from "express";

import {
  getPublicUser,
  deleteAccount,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.delete(
  "/delete-account",
  authMiddleware,
  deleteAccount
);

router.get(
  "/:uniqueId",
  getPublicUser
);

export default router;