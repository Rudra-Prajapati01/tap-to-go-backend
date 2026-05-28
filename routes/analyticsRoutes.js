import express from "express";

import Analytics
from "../models/Analytics.js";

const router =
  express.Router();

/* ───────────────────────────── */
/* GET ANALYTICS */
/* ───────────────────────────── */

router.get(
  "/:userId",

  async (req, res) => {

    try {

      let analytics =
        await Analytics.findOne({

          userId:
            req.params.userId,
        });

      if (!analytics) {

        analytics =
          await Analytics.create({

            userId:
              req.params.userId,
          });
      }

      res.json(
        analytics
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({

        message:
          error.message,
      });
    }
  }
);

/* ───────────────────────────── */
/* PROFILE VIEW */
/* ───────────────────────────── */

router.post(
  "/profile-view",

  async (req, res) => {

    try {

      console.log(
        "PROFILE VIEW:",
        req.body
      );

      await Analytics.findOneAndUpdate(

        {
          userId:
            req.body.userId.toString(),
        },

        {
          $inc: {

            profileViews: 1,
          },
        },

        {
          upsert: true,
          new: true,
        }
      );

      res.json({

        success: true,
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

/* ───────────────────────────── */
/* LINK CLICK */
/* ───────────────────────────── */

router.post(
  "/link-click",

  async (req, res) => {

    try {

      console.log(
        "LINK CLICK:",
        req.body
      );

      const {
        userId,
        platform,
      } = req.body;

      await Analytics.findOneAndUpdate(

        {
          userId:
            userId.toString(),
        },

        {
          $inc: {

            [`linkClicks.${platform}`]: 1,
          },
        },

        {
          upsert: true,
          new: true,
        }
      );

      res.json({

        success: true,
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

/* ───────────────────────────── */
/* NFC TAP */
/* ───────────────────────────── */

router.post(
  "/nfc-tap",

  async (req, res) => {

    try {

      console.log(
        "NFC TAP:",
        req.body
      );

      await Analytics.findOneAndUpdate(

        {
          userId:
            req.body.userId.toString(),
        },

        {
          $inc: {

            nfcTaps: 1,
          },
        },

        {
          upsert: true,
          new: true,
        }
      );

      res.json({

        success: true,
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

/* ───────────────────────────── */
/* QR SCAN */
/* ───────────────────────────── */

router.post(
  "/qr-scan",

  async (req, res) => {

    try {

      console.log(
        "QR SCAN:",
        req.body
      );

      await Analytics.findOneAndUpdate(

        {
          userId:
            req.body.userId.toString(),
        },

        {
          $inc: {

            qrScans: 1,
          },
        },

        {
          upsert: true,
          new: true,
        }
      );

      res.json({

        success: true,
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

export default router;