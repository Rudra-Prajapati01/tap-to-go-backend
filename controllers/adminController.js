import User from "../models/User.js";
import Lead from "../models/Lead.js";
import Product from "../models/Product.js";
import Analytics from "../models/Analytics.js";
import Order from "../models/Order.js"; // 1. Added Order Model Import

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

/* ==========================================
    ADMIN LOGIN
========================================== */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    if (admin.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
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
export const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalLeads = await Lead.countDocuments();

    const activeCards = await User.countDocuments({ qrActive: true });
    const inactiveCards = await User.countDocuments({ qrActive: false });

    const totalScans = await User.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalScans" },
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
        totalScans: totalScans[0]?.total || 0,
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
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

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
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const products = await Product.find({ userId: user._id });
    const leads = await Lead.find({ owner: user._id });
    const analytics = await Analytics.findOne({ userId: user._id });

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
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await Product.deleteMany({ userId: user._id });
    await Lead.deleteMany({ owner: user._id });
    await Analytics.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(user._id);

    res.json({
      success: true,
      message: "User deleted successfully",
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
export const activateCard = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { qrActive: true });

    res.json({
      success: true,
      message: "Card Activated",
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
export const deactivateCard = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { qrActive: false });

    res.json({
      success: true,
      message: "Card Deactivated",
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
export const getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

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

/* ==========================================
    UPDATE USER BY ADMIN
========================================== */
export const updateUserByAdmin = async (req, res) => {
  try {
    const existingUser = await User.findById(req.params.id);

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("ADMIN UPDATE BODY:", req.body);

    const updateData = { ...req.body };

    if (!updateData.uniqueId || updateData.uniqueId.trim() === "") {
      updateData.uniqueId = existingUser.uniqueId;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    console.log("UPDATED USER IMAGES:", {
      profile: updatedUser.profileImage,
      cover: updatedUser.coverImage,
      logo: updatedUser.logoImage,
    });

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

/* ==========================================
    FORGOT PASSWORD - Send OTP
========================================== */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    admin.resetOTP = otp;
    admin.resetOTPExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await admin.save();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: admin.email,
      subject: "JioTap Admin Password Reset OTP",
      html: `
        <h2>Admin Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>Valid for 10 minutes.</p>
      `,
    });

    res.json({ success: true, message: "OTP sent to your email" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ==========================================
    VERIFY OTP
========================================== */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    if (admin.resetOTP !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (admin.resetOTPExpiry < Date.now()) {
      return res.status(400).json({ success: false, message: "OTP Expired" });
    }

    res.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ==========================================
    RESET PASSWORD
========================================== */
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await User.findOne({ email, role: "admin" });

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    admin.password = hashedPassword;
    admin.resetOTP = null;
    admin.resetOTPExpiry = null;
    await admin.save();

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ==========================================
   2. GET ALL ORDERS (New Admin Order Feature)
========================================== */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   3. GET SINGLE ORDER
========================================== */
export const getOrderByIdAdmin = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ==========================================
   4. UPDATE ORDER STATUS
========================================== */
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, trackingNumber, shippingPartner } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        orderStatus,
        trackingNumber,
        shippingPartner,
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};