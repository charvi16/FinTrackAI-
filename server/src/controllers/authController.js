import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register new user
// @route   POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);
    console.log("REGISTERED:", user);

    return res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to register user" });
  }
};


// @desc    Login user
// @route   POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    console.log("📥 LOGIN HIT"); // LOG A
    const { email, password } = req.body;
    console.log("📌 LOG 1 → Incoming data:", { email, password }); // LOG 1

    const user = await User.findOne({ email });
    console.log("👤 LOG 2 → User found in DB:", user); // LOG 2
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🔐 LOG 3 → Password match:", isMatch); // LOG 3
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);
    

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        currency: user.currency,
        monthlyBudget: user.monthlyBudget,
        income: user.income,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login failed" });
  }
};


// @desc    Logout user (optional)
// @route   POST /api/auth/logout
const logoutUser = async (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

export { registerUser, loginUser, logoutUser };
