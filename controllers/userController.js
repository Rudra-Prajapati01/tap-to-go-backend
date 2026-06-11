import User from "../models/User.js";
import Product from "../models/Product.js";
import Lead from "../models/Lead.js";
import Analytics from "../models/Analytics.js";

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



export const deleteAccount = async (req, res) => {
  try {
    console.log("DELETE ACCOUNT HIT");

    const userId = req.user._id;

    await Product.deleteMany({
      userId: userId,
    });

    await Lead.deleteMany({
      owner: userId,
    });

    await Analytics.deleteMany({
      userId: userId,
    });

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });

  } catch (error) {

    console.error(
      "Delete Account Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

