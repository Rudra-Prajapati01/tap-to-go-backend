import User from "../models/User.js";

export const getPublicUser =
  async (req, res) => {

    try {

      const user =
        await User.findOne({
          uniqueId:
            req.params.uniqueId,
        });

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