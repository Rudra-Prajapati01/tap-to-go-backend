import Lead from "../models/Lead.js";

/* ───────────────────────────── */
/* CREATE LEAD */
/* ───────────────────────────── */

export const createLead =
  async (req, res) => {

    try {

      const lead =
        await Lead.create(
          req.body
        );

      res.status(201).json(
        lead
      );

    } catch (error) {

      console.log(error);

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/* ───────────────────────────── */
/* GET LEADS */
/* ───────────────────────────── */

export const getLeads =
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
  };

/* ───────────────────────────── */
/* UPDATE LEAD */
/* ───────────────────────────── */

export const updateLead =
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
  };

/* ───────────────────────────── */
/* DELETE LEAD */
/* ───────────────────────────── */

export const deleteLead =
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
  };