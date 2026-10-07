const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth.routes");
const cropRoutes = require("./routes/crop.routes");
const diseaseRoutes = require("./routes/disease.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const adminRoutes = require("./routes/admin.routes");
const connectDB = require("./config/db");

const app = express();

// ─── Connect to Database ──────────────────────────────────────
connectDB();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5174"], credentials: true }));
app.use(express.json({ limit: "10mb" }));

// ─── Routes ──────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/crop", cropRoutes);
app.use("/api/disease", diseaseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin", adminRoutes);

// ─── Health Check ────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "CropCare AI Backend is running 🌱" });
});

// ─── Global Error Handler ────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// ─── Start Server ────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌱 CropCare AI backend running on http://localhost:${PORT}`);
});
