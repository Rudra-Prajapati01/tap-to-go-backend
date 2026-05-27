import User from "../models/User.js";

import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";

import { nanoid } from "nanoid";

import { useEffect } from "react";

// REGISTER
export const registerUser = async (
  req,
  res
) => {

  try {

    const {
      name,
      username,
      email,
      password,
    } = req.body;

    // CHECK USER
    const userExists =
      await User.findOne({
        $or: [
          { email },
          { username },
        ],
      });

    if (userExists) {

      return res.status(400).json({
        message:
          "User already exists",
      });

    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // UNIQUE ID
    const uniqueId =
      "tap_" + nanoid(8);

    // CREATE USER
    const user = await User.create({

      name,

      username,

      email,

      password: hashedPassword,

      uniqueId,

    });

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

    res.status(201).json({

      token,

      user,

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
          Math.floor(
            Math.random() * 1000
          ),

        email,

        password: "google-auth",

        profileImage,

        uniqueId:
          "tap_" + nanoid(8),

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

// UPDATE PROFILE
export const updateProfile =
  async (req, res) => {

    try {

      const updatedUser =
        await User.findByIdAndUpdate(

          req.params.id,

          req.body,

          {
            new: true,
          }
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