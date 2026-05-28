import express from "express";

import Lead from "../models/Lead.js";

const router = express.Router();

/* CREATE */
router.post(
  "/",
  async (req, res) => {

    try {

      const lead =
        await Lead.create(
          req.body
        );

      res.status(201).json({
        success: true,
        lead,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

/* UPDATE */
router.put(
  "/update/:id",

  async (req, res) => {

    try {

      const updatedLead =
        await Lead.findByIdAndUpdate(

          req.params.id,

          req.body,

          {
            new: true,
          }
        );

      res.json({
        success: true,
        updatedLead,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Update Failed",
      });
    }
  }
);

/* DELETE */
router.delete(
  "/delete/:id",

  async (req, res) => {

    try {

      await Lead.findByIdAndDelete(

        req.params.id
      );

      res.json({
        success: true,
      });

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          "Delete Failed",
      });
    }
  }
);

/* GET LEADS */
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