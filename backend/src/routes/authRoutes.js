const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const ownerAuthController = require("../controllers/ownerAuthController");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/owner/signup", ownerAuthController.ownerSignup);

module.exports = router;
