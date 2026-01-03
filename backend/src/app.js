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

/* ===== CORS (SAFE – NO CRASH) ===== */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow server-to-server, Postman, health checks
    if (!origin) return callback(null, true);

    // Allow localhost and ALL Vercel deployments
    if (
      origin === "http://localhost:3000" ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    // ❗ IMPORTANT: do NOT throw error
    return callback(null, false);
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

/* ===== BODY PARSERS ===== */
app.use(express.json());

/* ===== HEALTH CHECK ===== */
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend running successfully 🚀" });
});

/* ===== ROUTES ===== */
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", userRoutes);
app.use("/api/owner", ownerRoutes);

/* ===== 404 HANDLER ===== */
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

/* ===== DB SYNC & ADMIN SEED ===== */
syncModels()
  .then(async () => {
    const { User } = require("./models");
    const bcrypt = require("bcryptjs");

    const adminExists = await User.findOne({
      where: { role: process.env.ADMIN_ROLE },
    });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash(
        process.env.ADMIN_PASSWORD,
        10
      );

      await User.create({
        name: process.env.ADMIN_NAME,
        email: process.env.ADMIN_EMAIL,
        address: "Admin Address",
        password: hashedPassword,
        role: process.env.ADMIN_ROLE,
      });

      console.log("✅ Admin user created");
    } else {
      console.log("ℹ️ Admin already exists");
    }
  })
  .catch((err) => {
    console.error("❌ DB sync failed:", err);
  });

module.exports = app;
