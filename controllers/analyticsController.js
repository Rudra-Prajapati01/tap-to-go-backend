import Analytics
from "../models/Analytics.js";

export const getAnalytics =
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

    res.json(analytics);

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });
  }
};