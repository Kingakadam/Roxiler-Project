const bcrypt = require("bcryptjs");
const { User, Store } = require("../models");
const { generateToken } = require("../config/jwt");

// basic validators for backend safety
function isValidPassword(pwd) {
  const re = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
  return re.test(pwd);
}

exports.ownerSignup = async (req, res) => {
  try {
    const { name, email, address, password, storeName, storeAddress, storeEmail } = req.body;

    // form validations
    if (!name || name.length > 20) {
      return res.status(400).json({ message: "Invalid name length" });
    }

    if (!email) return res.status(400).json({ message: "Email required" });

    if (!address || address.length > 400) {
      return res.status(400).json({ message: "Invalid address" });
    }

    if (!password || !isValidPassword(password)) {
      return res.status(400).json({
        message:
          "Password must be 8-16 chars, contain 1 uppercase & 1 special character",
      });
    }

    if (!storeName || !storeAddress || !storeEmail) {
      return res.status(400).json({ message: "Store details required" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const owner = await User.create({
      name,
      email,
      address,
      password: hashed,
      role: "OWNER",
    });

    const store = await Store.create({
      name: storeName,
      email: storeEmail,
      address: storeAddress,
      ownerId: owner.id,
    });

    const token = generateToken({ id: owner.id, role: owner.role });

    return res.status(201).json({
      message: "Owner created successfully",
      token,
      user: owner,
      store,
    });
  } catch (err) {
    console.error("Owner signup error", err);
    return res.status(500).json({ message: "Server error" });
  }
};
