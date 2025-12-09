const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

// Protect all admin routes
router.use(authMiddleware);

// Admin dashboard — stats
router.get("/dashboard", adminController.getDashboardStats);

// List all users
router.get("/users", adminController.getUsers);

// List all stores
router.get("/stores", adminController.getStores);

// Create new user (Admin can add Admin/User/Owner)
router.post("/users", adminController.createUser);

// Create new store
router.post("/stores", adminController.createStore);

module.exports = router;
