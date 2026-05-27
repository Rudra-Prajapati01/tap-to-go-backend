import express from "express";

import User from "../models/User.js";

const router = express.Router();

// GET USER BY UNIQUE ID
router.get(
  "/:uniqueId",
  async (req, res) => {

    try {

      const user =
        await User.findOne({
          uniqueId:
            req.params.uniqueId,
        });

      if (!user) {

        return res
          .status(404)
          .json({
            message:
              "User not found",
          });

      }

      res.status(200).json(user);

    } catch (error) {

      res.status(500).json({
        message: error.message,
      });

    }

  }
);

export default router;