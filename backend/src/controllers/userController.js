const { Store, Rating, User } = require("../models");
const { Op } = require("sequelize");

exports.getStoresWithRatings = async (req, res) => {
  try {
    const userId = req.user.id;
    const { search } = req.query;
    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { address: { [Op.like]: `%${search}%` } },
      ];
    }
    const stores = await Store.findAll({
      where,
      include: [
        {
          model: Rating,
          attributes: ["value", "userId"],
        },
      ],
    });

    const formatted = stores.map((store) => {
      const ratings = store.Ratings.map((r) => r.value);
      const avg =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : null;

      const userRating = store.Ratings.find((r) => r.userId === userId)?.value || null;

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        averageRating: avg,
        userRating: userRating,
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error("Store fetch error", err);
    res.status(500).json({ message: "Failed to fetch stores" });
  }
};

exports.rateStore = async (req, res) => {
  try {
    const { storeId } = req.params;
    const { value } = req.body;
    const userId = req.user.id;

    let rating = await Rating.findOne({ where: { storeId, userId } });

    if (!rating) {
      rating = await Rating.create({ storeId, userId, value });
    } else {
      rating.value = value;
      await rating.save();
    }

    const ratings = await Rating.findAll({ where: { storeId } });
    const avg =
      ratings.reduce((a, b) => a + b.value, 0) / ratings.length || 0;

    await Store.update({ averageRating: avg }, { where: { id: storeId } });

    res.json({ message: "Rating updated", averageRating: avg });
  } catch (err) {
    console.error("Rate error", err);
    res.status(500).json({ message: "Failed to submit rating" });
  }
};
