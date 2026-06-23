import User from "../models/User.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import { nanoid } from "nanoid";

import nodemailer from "nodemailer";



// REGISTER
export const registerUser = async (req, res) => {
  try {

    const {
      name,
      username,
      email,
      password,
    } = req.body;

    const userExists =
      await User.findOne({
        $or: [
          { email },
          { username },
        ],
      });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const uniqueId =
      "tap_" + nanoid(8);

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      uniqueId,

      isVerified: false,
      verificationOTP: otp,
      verificationOTPExpiry:
        Date.now() + 10 * 60 * 1000,
    });

    const transporter =
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify Your EasyTap Account",
      html: `
        <h2>Welcome to EasyTap</h2>
        <p>Your verification OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
      `,
    });

    res.status(201).json({
      success: true,
      message: "OTP sent successfully",
      email,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// LOGIN
export const loginUser = async (
  req,
  res
) => {

  try {

    const {
      email,
      password,
    } = req.body;

    // FIND USER
    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        message:
          "Invalid credentials",
      });

    }

    // CHECK PASSWORD
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!user.isVerified) {
      return res.status(401).json({
        message:
          "Please verify your email first",
      });
    }

    if (!isMatch) {

      return res.status(400).json({
        message:
          "Invalid credentials",
      });

    }

    // TOKEN
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({

      token,

      user,

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};


// GOOGLE LOGIN
export const googleLogin = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      profileImage,
    } = req.body;

    // CHECK EXISTING USER
    let user =
      await User.findOne({ email });

    // CREATE USER IF NOT EXISTS
    if (!user) {

      user = await User.create({
        name,
        username:
          email.split("@")[0] +
          Math.floor(Math.random() * 1000),

        email,

        password: "google-auth",

        profileImage,

        uniqueId: "tap_" + nanoid(8),

        isVerified: true,
      });

    }

    // TOKEN
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({

      token,

      user,

    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

export const updateProfile =
  async (req, res) => {

    try {

      console.log("========== UPDATE PROFILE ==========");
      console.log("PROFILE IMAGE FROM FRONTEND:");
      console.log(req.body.profileImage);

      console.log("COVER IMAGE FROM FRONTEND:");
      console.log(req.body.coverImage);

      console.log("LOGO IMAGE FROM FRONTEND:");
      console.log(req.body.logoImage);

      const existingUser =
        await User.findById(
          req.params.id
        );

      if (!existingUser) {

        return res.status(404).json({
          message: "User not found",
        });

      }

      const updateData = {
        ...req.body,
      };

      const updatedUser =
        await User.findByIdAndUpdate(
          req.params.id,
          updateData,
          {
            new: true,
          }
        );

      console.log("========== UPDATED USER ==========");
      console.log(
        "PROFILE:",
        updatedUser.profileImage
      );

      console.log(
        "COVER:",
        updatedUser.coverImage
      );

      console.log(
        "LOGO:",
        updatedUser.logoImage
      );

      res.status(200).json(
        updatedUser
      );

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });

    }

  };

export const getUserById = async (
  req,
  res
) => {

  try {

    const user =
      await User.findById(
        req.params.id
      );

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });

    }

    res.status(200).json(user);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }

};

export const sendResetOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "Email not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.resetOTP = otp;
    user.resetOTPExpiry =
      Date.now() + 10 * 60 * 1000;

    await user.save();

    const transporter =
      nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "EasyTap Password Reset OTP",
      html: `
      <!DOCTYPE html>
      <html>
      <head>
      <meta charset="UTF-8">
      </head>

      <body style="
      margin:0;
      padding:0;
      background:#f4f7fb;
      font-family:Arial,sans-serif;
      ">

      <div style="
      max-width:600px;
      margin:40px auto;
      background:#ffffff;
      border-radius:20px;
      overflow:hidden;
      box-shadow:0 10px 30px rgba(0,0,0,0.08);
      ">

      <!-- Header -->
      <div style="
      background:linear-gradient(135deg,#0B4DBB 0%,#4CAF1D 100%);
      padding:35px;
      text-align:center;
      ">

      <h1 style="
      margin:0;
      color:white;
      font-size:30px;
      ">
      EasyTap
      </h1>

      <p style="
      margin-top:10px;
      color:white;
      font-size:15px;
      ">
      Smart NFC Business Cards
      </p>

      </div>

      <!-- Content -->
      <div style="padding:40px;">

      <h2 style="
      color:#111827;
      margin-top:0;
      ">
      Password Reset Request
      </h2>

      <p style="
      font-size:15px;
      color:#555;
      line-height:1.7;
      ">
      We received a request to reset your EasyTap account password.
      Use the verification code below:
      </p>

      <div style="
      margin:30px auto;
      background:#F4F8FF;
      border:2px dashed #0B4DBB;
      border-radius:16px;
      padding:20px;
      text-align:center;
      ">

      <div style="
      font-size:42px;
      font-weight:700;
      letter-spacing:8px;
      color:#0B4DBB;
      ">
      ${otp}
      </div>

      </div>

      <p style="
      font-size:15px;
      color:#666;
      ">
      ⏰ This OTP will expire in
      <strong>10 minutes</strong>.
      </p>

      <p style="
      font-size:15px;
      color:#666;
      line-height:1.6;
      ">
      If you did not request a password reset,
      you can safely ignore this email.
      </p>

      </div>

      <!-- Footer -->
      <div style="
      background:#F9FAFB;
      padding:25px;
      text-align:center;
      border-top:1px solid #eee;
      ">

      <p style="
      margin:0;
      color:#777;
      font-size:13px;
      ">
      © 2026 EasyTap. All rights reserved.
      </p>

      <p style="
      margin-top:8px;
      color:#999;
      font-size:12px;
      ">
      Secure • Fast • Smart Networking
      </p>

      </div>

      </div>

      </body>
      </html>
      `,
    });

    res.json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyResetOTP = async (
  req,
  res
) => {
  try {
    const { email, otp } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (
      !user ||
      user.resetOTP !== otp
    ) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (
      user.resetOTPExpiry <
      Date.now()
    ) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    res.json({
      message: "OTP verified",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const resetPassword = async (
  req,
  res
) => {
  try {
    const {
      email,
      otp,
      password,
    } = req.body;

    const user =
      await User.findOne({
        email,
      });

    if (
      !user ||
      user.resetOTP !== otp
    ) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (
      user.resetOTPExpiry <
      Date.now()
    ) {
      return res.status(400).json({
        message: "OTP expired",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    user.password =
      hashedPassword;

    user.resetOTP = null;
    user.resetOTPExpiry = null;

    await user.save();

    res.json({
      message:
        "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyRegistrationOTP =
  async (req, res) => {

    try {

      const { email, otp } = req.body;

      const user =
        await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      if (
        user.verificationOTP !== otp
      ) {
        return res.status(400).json({
          message: "Invalid OTP",
        });
      }

      if (
        user.verificationOTPExpiry <
        Date.now()
      ) {
        return res.status(400).json({
          message: "OTP expired",
        });
      }

      user.isVerified = true;
      user.verificationOTP = null;
      user.verificationOTPExpiry = null;

      await user.save();

      res.json({
        success: true,
        message:
          "Email verified successfully",
      });

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }
  };
