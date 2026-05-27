import express from "express";

import {
  createLead,
} from "../controllers/leadController.js";

import Lead from "../models/Lead.js";

const router = express.Router();


// CREATE LEAD
router.post(
  "/",
  async (req, res) => {

    try {

      const lead =
        await Lead.create(req.body);

      res.status(201).json({
        success: true,
        lead,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// GET LEADS
router.get(
  "/:ownerId",

  async (req, res) => {

    try {

      const leads =
        await Lead.find({

          owner:
            req.params.ownerId,

        }).sort({

          createdAt: -1,
        });

      res.json(leads);

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Server Error",
      });
    }
  }
);

export default router;