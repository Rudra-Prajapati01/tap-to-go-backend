import User from "../models/User.js";
import Product from "../models/Product.js";
import Lead from "../models/Lead.js";
import Analytics from "../models/Analytics.js";
import cloudinary from "../config/cloudinary.js";
import streamifier from "streamifier";

// =====================================
// PUBLIC PROFILE
// =====================================
export const getPublicUser = async (
  req,
  res
) => {
  try {

    const user = await User.findOne({
      uniqueId: req.params.uniqueId,
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json(user);

  } catch (error) {

    return res.status(500).json({
      message: error.message,
    });

  }
};

// =====================================
// DELETE ACCOUNT
// =====================================
export const deleteAccount = async (
  req,
  res
) => {
  try {

    console.log("DELETE ACCOUNT HIT");

    const userId = req.user._id;

    await Product.deleteMany({
      userId,
    });

    await Lead.deleteMany({
      owner: userId,
    });

    await Analytics.deleteMany({
      userId,
    });

    await User.findByIdAndDelete(
      userId
    );

    return res.status(200).json({
      success: true,
      message:
        "Account deleted successfully",
    });

  } catch (error) {

    console.error(
      "Delete Account Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// SAVE GALLERY IMAGES
// =====================================
export const saveGalleryImages = async (
  req,
  res
) => {
  try {

    const {
      userId,
      images,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message:
          "User ID is required",
      });
    }

    const user =
      await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.gallery) {
      user.gallery = [];
    }

    user.gallery.push(...images);

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Gallery saved successfully",
      gallery: user.gallery,
    });

  } catch (error) {

    console.error(
      "Gallery Save Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// GET USER GALLERY
// =====================================
export const getUserGallery = async (
  req,
  res
) => {
  try {

    const user =
      await User.findById(
        req.params.userId
      );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      gallery:
        user.gallery || [],
    });

  } catch (error) {

    console.error(
      "Get Gallery Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// DELETE GALLERY IMAGE
// =====================================
export const deleteGalleryImage = async (
  req,
  res
) => {
  try {

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.gallery = user.gallery.filter(
      (img) =>
        img._id.toString() !==
        req.params.imageId
    );

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Image deleted",
      gallery: user.gallery,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// UPDATE GALLERY TITLE
// =====================================

export const updateGalleryImage = async (
  req,
  res
) => {
  try {

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const image = user.gallery.id(
      req.params.imageId
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    // Update Title
    image.title =
      req.body.title || image.title;

    // New Image Selected
    if (req.file) {

      // Delete old image from Cloudinary
      if (image.publicId) {
        try {
          await cloudinary.uploader.destroy(
            image.publicId
          );
        } catch (err) {
          console.log(
            "Old image delete failed",
            err
          );
        }
      }

      // Upload new image
      const result =
        await new Promise(
          (resolve, reject) => {

            const stream =
              cloudinary.uploader.upload_stream(
                {
                  folder:
                    "tap-to-go/gallery",
                },
                (
                  error,
                  result
                ) => {

                  if (error)
                    reject(error);
                  else
                    resolve(result);

                }
              );

            streamifier
              .createReadStream(
                req.file.buffer
              )
              .pipe(stream);
          }
        );

      image.url =
        result.secure_url;

      image.publicId =
        result.public_id;
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Gallery image updated",
      gallery: user.gallery,
    });

  } catch (error) {

    console.error(
      "Gallery Update Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


export const updateGalleryImageFull =
  async (req, res) => {
    try {

      const {
        title,
        url,
        publicId,
      } = req.body;

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const image =
        user.gallery.id(
          req.params.imageId
        );

      if (!image) {
        return res.status(404).json({
          success: false,
          message: "Image not found",
        });
      }

      image.title = title;
      image.url = url;
      image.publicId = publicId;

      await user.save();

      return res.status(200).json({
        success: true,
        gallery: user.gallery,
      });

    } catch (error) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };