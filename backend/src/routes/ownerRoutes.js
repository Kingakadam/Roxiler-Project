const express = require("express");
const router = express.Router();
const ownerController = require("../controllers/ownerController");
const authMiddleware = require("../middleware/authMiddleware");

router.use(authMiddleware);

router.get("/store", ownerController.getStoreDetails);
router.get("/store/ratings", ownerController.getStoreRatings);

module.exports = router;
