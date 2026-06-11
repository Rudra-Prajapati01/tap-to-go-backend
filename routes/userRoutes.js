import express from "express";

import {
  getPublicUser,
  deleteAccount,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/*
|--------------------------------------------------------------------------
| TEST ROUTE
|--------------------------------------------------------------------------
*/
router.get("/test-route", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "NEW ROUTE WORKING",
  });
});

/*
|--------------------------------------------------------------------------
| BROWSER TEST ROUTE
|--------------------------------------------------------------------------
| Browser me open karne par ye chalega
*/
router.get("/delete-account", (req, res) => {
  return res.status(200).json({
    success: true,
    message:
      "Delete account endpoint exists. Use DELETE request with JWT token.",
  });
});

/*
|--------------------------------------------------------------------------
| ACTUAL DELETE ACCOUNT ROUTE
|--------------------------------------------------------------------------
*/
router.delete(
  "/delete-account",
  authMiddleware,
  deleteAccount
);

/*
|--------------------------------------------------------------------------
| PUBLIC USER PROFILE
|--------------------------------------------------------------------------
| Always keep this LAST
|--------------------------------------------------------------------------
*/
router.get(
  "/:uniqueId",
  getPublicUser
);

export default router;