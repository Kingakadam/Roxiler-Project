const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const auth = require("../middleware/authMiddleware");

router.use(authMiddleware); // user must be logged in

router.get("/user/stores", auth, userController.getStoresWithRatings);
router.post("/stores/:storeId/rating", userController.rateStore);
router.put("/stores/:storeId/rating", userController.rateStore);

module.exports = router;
