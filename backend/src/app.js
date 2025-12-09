const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { syncModels } = require("./models");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const ownerRoutes = require("./routes/ownerRoutes");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend running successfully 🚀" });
});

// Routes
app.use("/api/auth", authRoutes);     // signup, login
app.use("/api/admin", adminRoutes);   // admin features (protected)
app.use("/api", userRoutes);          // normal user: /stores, rate
app.use("/api/owner", ownerRoutes);   // store owner dashboard


// 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Sync Models on startup
syncModels().then(async () => {
  const { User } = require("./models");
  const bcrypt = require("bcryptjs");

  // Create admin user if not exists
  const adminExists = await User.findOne({ where: { role: "ADMIN" } });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash("Ironman@1234", 10);
    await User.create({
      name: "ironman",
      email: "admin@gmail.com",
      address: "Admin Address",
      password: hashedPassword,
      role: "ADMIN",
    });
  }
});

module.exports = app;
