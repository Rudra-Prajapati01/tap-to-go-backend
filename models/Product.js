import mongoose from "mongoose";

const productSchema =
  new mongoose.Schema(

    {
      userId: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "User",

        required: true,
      },

      image: {
        type: String,
        default: "",
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      description: {
        type: String,
        default: "",
        trim: true,
      },

      price: {
        type: String,
        default: "",
      },

      currency: {
        type: String,
        default: "₹",

        enum: [
          "₹",
          "$",
          "€",
          "£",
        ],
      },

      showPrice: {
        type: Boolean,
        default: true,
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },

    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Product",
  productSchema
);