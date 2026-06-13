import express from "express";
import multer from "multer";

import {
  getPublicUser,
  deleteAccount,
  saveGalleryImages,
  getUserGallery,
  deleteGalleryImage,
  updateGalleryImage,
  updateGalleryImageFull,
} from "../controllers/userController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/test-route", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "NEW ROUTE WORKING",
  });
});
const storage = multer.memoryStorage();

const upload = multer({
  storage,
});
router.get("/delete-account", (req, res) => {
  return res.status(200).json({
    success: true,
    message:
      "Delete account endpoint exists. Use DELETE request with JWT token.",
  });
});

router.delete(
  "/delete-account",
  authMiddleware,
  deleteAccount
);

router.post(
  "/gallery/save",
  authMiddleware,
  saveGalleryImages
);

// 🔥 THIS WAS MISSING
router.get(
  "/gallery/:userId",
  getUserGallery
);


router.delete(
  "/gallery/image/:imageId",
  authMiddleware,
  deleteGalleryImage
);

router.put(
  "/gallery/image/:imageId",
  authMiddleware,
  upload.single("image"),
  updateGalleryImage
);

router.put(
  "/gallery/image/:imageId/update",
  authMiddleware,
  updateGalleryImageFull
);

router.get(
  "/:uniqueId",
  getPublicUser
);


export default router;