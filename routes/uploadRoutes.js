import express from "express";

import multer from "multer";

import cloudinary
from "../config/cloudinary.js";

const router =
  express.Router();

const storage =
  multer.memoryStorage();

const upload =
  multer({
    storage,
  });


// ==============================
// PROFILE IMAGE UPLOAD
// ==============================
router.post(

  "/profile",

  upload.single("image"),

  async (req, res) => {

    try {

      const file =
        req.file;

      if (!file) {

        return res.status(400).json({

          message:
            "No image uploaded",
        });
      }

      const result =
        await cloudinary.uploader.upload(

          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,

          {
            folder:
              "tap-to-go/profile",
          }
        );

      res.status(200).json({

        success: true,

        imageUrl:
          result.secure_url,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,
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

      const file =
        req.file;

      if (!file) {

        return res.status(400).json({

          message:
            "No image uploaded",
        });
      }

      const result =
        await cloudinary.uploader.upload(

          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,

          {
            folder:
              "tap-to-go/products",
          }
        );

      res.status(200).json({

        success: true,

        imageUrl:
          result.secure_url,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        success: false,

        message:
          error.message,
      });
    }
  }
);

export default router;