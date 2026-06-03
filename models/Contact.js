import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    phone: String,
    company: String,
    message: String,
    status: {
      type: String,
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Contact",
  contactSchema
);