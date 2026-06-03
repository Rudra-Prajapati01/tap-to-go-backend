import User from "../models/User.js";
import Lead from "../models/Lead.js";
import Product from "../models/Product.js";
import Analytics from "../models/Analytics.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/* ==========================================
   ADMIN LOGIN
========================================== */

export const adminLogin = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
    } = req.body;

    const admin =
      await User.findOne({
        email,
      });

    if (!admin) {

      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });

    }

    if (
      admin.role !== "admin"
    ) {

      return res.status(403).json({
        success: false,
        message: "Access denied",
      });

    }

    const isMatch =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!isMatch) {

      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });

    }

    const token =
      jwt.sign(
        {
          id: admin._id,
          role: admin.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );

    res.status(200).json({

      success: true,

      token,

      admin: {

        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,

      },

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });

  }

};

/* ==========================================
   DASHBOARD STATS
========================================== */

export const getDashboardStats =
  async (req, res) => {

    try {

      const totalUsers =
        await User.countDocuments();

      const totalProducts =
        await Product.countDocuments();

      const totalLeads =
        await Lead.countDocuments();

      const activeCards =
        await User.countDocuments({
          qrActive: true,
        });

      const inactiveCards =
        await User.countDocuments({
          qrActive: false,
        });

      const totalScans =
        await User.aggregate([
          {
            $group: {
              _id: null,
              total: {
                $sum: "$totalScans",
              },
            },
          },
        ]);

      res.json({

        success: true,

        stats: {

          totalUsers,

          totalProducts,

          totalLeads,

          activeCards,

          inactiveCards,

          totalScans:
            totalScans[0]?.total || 0,

        },

      });

    } catch (error) {

      res.status(500).json({

        success: false,
        message: error.message,

      });

    }

  };

/* ==========================================
   GET ALL USERS
========================================== */

export const getAllUsers =
  async (req, res) => {

    try {

      const users =
        await User.find()
          .select("-password")
          .sort({
            createdAt: -1,
          });

      res.json({

        success: true,
        users,

      });

    } catch (error) {

      res.status(500).json({

        success: false,
        message: error.message,

      });

    }

  };

/* ==========================================
   GET USER DETAILS
========================================== */

export const getUserById =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        ).select("-password");

      if (!user) {

        return res.status(404).json({

          success: false,
          message: "User not found",

        });

      }

      const products =
        await Product.find({
          userId: user._id,
        });

      const leads =
        await Lead.find({
          owner: user._id,
        });

      const analytics =
        await Analytics.findOne({
          userId: user._id,
        });

      res.json({

        success: true,

        user,

        products,

        leads,

        analytics,

      });

    } catch (error) {

      res.status(500).json({

        success: false,
        message: error.message,

      });

    }

  };

/* ==========================================
   DELETE USER
========================================== */

export const deleteUser =
  async (req, res) => {

    try {

      const user =
        await User.findById(
          req.params.id
        );

      if (!user) {

        return res.status(404).json({

          success: false,
          message: "User not found",

        });

      }

      await Product.deleteMany({
        userId: user._id,
      });

      await Lead.deleteMany({
        owner: user._id,
      });

      await Analytics.deleteMany({
        userId: user._id,
      });

      await User.findByIdAndDelete(
        user._id
      );

      res.json({

        success: true,
        message:
          "User deleted successfully",

      });

    } catch (error) {

      res.status(500).json({

        success: false,
        message: error.message,

      });

    }

  };

/* ==========================================
   ACTIVATE CARD
========================================== */

export const activateCard =
  async (req, res) => {

    try {

      await User.findByIdAndUpdate(
        req.params.id,
        {
          qrActive: true,
        }
      );

      res.json({

        success: true,
        message:
          "Card Activated",

      });

    } catch (error) {

      res.status(500).json({

        success: false,
        message: error.message,

      });

    }

  };

/* ==========================================
   DEACTIVATE CARD
========================================== */

export const deactivateCard =
  async (req, res) => {

    try {

      await User.findByIdAndUpdate(
        req.params.id,
        {
          qrActive: false,
        }
      );

      res.json({

        success: true,
        message:
          "Card Deactivated",

      });

    } catch (error) {

      res.status(500).json({

        success: false,
        message: error.message,

      });

    }

  };

/* ==========================================
   GET ALL LEADS
========================================== */

export const getAllLeads =
  async (req, res) => {

    try {

      const leads =
        await Lead.find()
          .populate(
            "owner",
            "name email"
          )
          .sort({
            createdAt: -1,
          });

      res.json({

        success: true,
        leads,

      });

    } catch (error) {

      res.status(500).json({

        success: false,
        message: error.message,

      });

    }

  };

export const updateUserByAdmin = async (req, res) => {
  try {

    const existingUser = await User.findById(req.params.id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("ADMIN UPDATE BODY:");
    console.log(req.body);

    const updateData = {
      ...req.body,
    };

    if (
      !updateData.uniqueId ||
      updateData.uniqueId.trim() === ""
    ) {
      updateData.uniqueId =
        existingUser.uniqueId;
    }

    const updatedUser =
      await User.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
        }
      );

    console.log("UPDATED USER:");
    console.log(updatedUser.profileImage);
    console.log(updatedUser.coverImage);
    console.log(updatedUser.logoImage);

    return res.json({
      success: true,
      user: updatedUser,
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};