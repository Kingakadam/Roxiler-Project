const bcrypt = require("bcryptjs");
const { User } = require("../models");
const { generateToken } = require("../config/jwt");

// basic validators for backend safety
function isValidPassword(pwd) {
  const re = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
  return re.test(pwd);
}

exports.signup = async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    // form validations again (same as frontend)
    if (!name || name.length > 20 ) {
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

    if (!["ADMIN", "USER", "OWNER"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      address,
      password: hashed,
      role,
    });

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error("Signup error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken({ id: user.id, role: user.role });

    return res.json({
      token,
      role: user.role,
      userId: user.id,
    });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ message: "Server error" });
  }
};
