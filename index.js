import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";



dotenv.config();

// TEST LOGS
console.log("TEST_VAR =", process.env.TEST_VAR);
console.log("Cloud =", process.env.CLOUDINARY_CLOUD_NAME);
console.log("API =", process.env.CLOUDINARY_API_KEY);
console.log("Secret =", process.env.CLOUDINARY_API_SECRET);

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use(
  "/api/contacts",
  contactRoutes
);
// Test Route
app.get("/", (req, res) => {
  res.send("JioTap API Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});