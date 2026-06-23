import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";

import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import leadRoutes from "./routes/leadRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import hardwareOrderRoutes from "./routes/hardwareOrderRoutes.js";

dotenv.config();

// Production Safe Log
console.log("🚀 EasyTap Server Starting...");

connectDB();

const app = express();

/* ========================================
   SECURITY HEADERS
======================================== */

app.use(helmet());

app.use(
  helmet.hsts({
    maxAge: 31536000, // 1 Year
    includeSubDomains: true,
    preload: true,
  })
);

app.use(
  helmet.referrerPolicy({
    policy: "strict-origin-when-cross-origin",
  })
);

// Extra Security Headers
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-Content-Type-Options", "nosniff");

  res.setHeader(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  next();
});

/* ========================================
   MIDDLEWARE
======================================== */

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ========================================
   ROUTES
======================================== */

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/products", productRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/hardware-orders", hardwareOrderRoutes);
/* ========================================
   TEST ROUTE
======================================== */

app.get("/", (req, res) => {
  res.send("EasyTap API Running...");
});

/* ========================================
   404 HANDLER
======================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

/* ========================================
   ERROR HANDLER
======================================== */

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/* ========================================
   START SERVER
======================================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});