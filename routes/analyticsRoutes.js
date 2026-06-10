import express from "express";

import Analytics
  from "../models/Analytics.js";

const router =
  express.Router();


const updateDailyStats = (analytics, field) => {
  const today = new Date().toISOString().split("T")[0];

  let day = analytics.dailyStats.find(
    (d) => d.date === today
  );

  if (!day) {
    analytics.dailyStats.push({
      date: today,
      profileViews: 0,
      linkClicks: 0,
      nfcTaps: 0,
      qrScans: 0,
      leads: 0,
    });

    day = analytics.dailyStats[
      analytics.dailyStats.length - 1
    ];
  }

  day[field] += 1;
};
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
      let analytics = await Analytics.findOne({
        userId: req.body.userId.toString(),
      });

      if (!analytics) {
        analytics = await Analytics.create({
          userId: req.body.userId,
        });
      }

      analytics.profileViews += 1;

      updateDailyStats(
        analytics,
        "profileViews"
      );

      await analytics.save();

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

      let analytics = await Analytics.findOne({
        userId: userId.toString(),
      });

      if (!analytics) {
        analytics = await Analytics.create({
          userId,
        });
      }

      analytics.linkClicks[platform] += 1;

      updateDailyStats(
        analytics,
        "linkClicks"
      );

      await analytics.save();

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

      let analytics = await Analytics.findOne({
        userId: req.body.userId.toString(),
      });

      if (!analytics) {
        analytics = await Analytics.create({
          userId: req.body.userId,
        });
      }

      analytics.nfcTaps += 1;

      updateDailyStats(
        analytics,
        "nfcTaps"
      );

      await analytics.save();

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

      let analytics = await Analytics.findOne({
        userId: req.body.userId.toString(),
      });

      if (!analytics) {
        analytics = await Analytics.create({
          userId: req.body.userId,
        });
      }

      analytics.qrScans += 1;

      updateDailyStats(
        analytics,
        "qrScans"
      );

      await analytics.save();

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