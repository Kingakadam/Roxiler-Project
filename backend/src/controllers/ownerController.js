const { Store, Rating, User } = require("../models");

exports.getStoreDetails = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const store = await Store.findOne({ where: { ownerId } });

    if (!store) {
      return res.status(404).json({ message: "No store assigned to this owner" });
    }

    res.json(store);
  } catch (err) {
    console.error("Owner store error", err);
    res.status(500).json({ message: "Failed to fetch store" });
  }
};

exports.getStoreRatings = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const store = await Store.findOne({ where: { ownerId } });
    if (!store) return res.status(404).json({ message: "Store not found" });

    const ratings = await Rating.findAll({
      where: { storeId: store.id },
      include: [{ 
  model: User, 
  as: "user",
  attributes: ["name", "email"] 
}],

    });

    res.json(ratings);
  } catch (err) {
    console.error("Owner rating error", err);
    res.status(500).json({ message: "Failed to fetch ratings" });
  }
};
