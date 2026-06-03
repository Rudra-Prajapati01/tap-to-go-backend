import express from "express";
import multer from "multer";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// ==============================
// PROFILE IMAGE UPLOAD
// ==============================
router.post(
  "/profile",
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("========== PROFILE UPLOAD ==========");
      console.log("FILE:", req.file);

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image uploaded",
        });
      }

      const result = await new Promise(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "tap-to-go/profile",
              resource_type: "auto",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          streamifier
            .createReadStream(req.file.buffer)
            .pipe(stream);
        }
      );

      console.log("UPLOAD SUCCESS:");
      console.log(result.secure_url);

      return res.status(200).json({
        success: true,
        imageUrl: result.secure_url,
      });

    } catch (error) {
      console.log("========== PROFILE ERROR ==========");
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// ==============================
// PRODUCT IMAGE UPLOAD
// ==============================
router.post(
  "/product",
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("========== PRODUCT UPLOAD ==========");
      console.log("FILE:", req.file);

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No image uploaded",
        });
      }

      const result = await new Promise(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "tap-to-go/products",
              resource_type: "auto",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          streamifier
            .createReadStream(req.file.buffer)
            .pipe(stream);
        }
      );

      console.log("UPLOAD SUCCESS:");
      console.log(result.secure_url);

      return res.status(200).json({
        success: true,
        imageUrl: result.secure_url,
      });

    } catch (error) {
      console.log("========== PRODUCT ERROR ==========");
      console.error(error);

      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

export default router;