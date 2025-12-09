const { User, Store, Rating } = require("../models");
const bcrypt = require("bcryptjs");

// --- Dashboard Stats ---
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count({ where: { role: "USER" } });
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();

    res.json({
      totalUsers,
      totalStores,
      totalRatings,
    });
  } catch (err) {
    console.error("Dashboard error", err);
    res.status(500).json({ message: "Dashboard fetch failed" });
  }
};

// --- List All Users ---
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "address", "role"],
    });

    res.json(users);
  } catch (err) {
    console.error("Users fetch error", err);
    res.status(500).json({ message: "Failed to get users" });
  }
};

// --- List All Stores ---
exports.getStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      include: [
        {
          model: Rating,
          attributes: ["value"],
        },
      ],
    });

    const response = stores.map((store) => {
      const ratings = store.Ratings.map((r) => r.value);
      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        averageRating:
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : null,
      };
    });

    res.json(response);
  } catch (err) {
    console.error("Stores fetch error", err);
    res.status(500).json({ message: "Failed to get stores" });
  }
};

// --- Admin Creates New User ---
exports.createUser = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    if (!["ADMIN", "OWNER", "USER"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      address,
      password: hashed,
      role,
    });

    res.json({ message: "User created successfully" });
  } catch (err) {
    console.error("Admin create user error", err);
    res.status(500).json({ message: "User creation failed" });
  }
};

// --- Admin Creates New Store ---
exports.createStore = async (req, res) => {
  try {
    const { name, email, address, ownerId } = req.body;

    const owner = await User.findByPk(ownerId);
    if (!owner || owner.role !== "OWNER") {
      return res.status(400).json({ message: "Invalid owner" });
    }

    await Store.create({
      name,
      email,
      address,
      ownerId,
    });

    res.json({ message: "Store created successfully" });
  } catch (err) {
    console.error("Admin create store error", err);
    res.status(500).json({ message: "Store creation failed" });
  }
};
