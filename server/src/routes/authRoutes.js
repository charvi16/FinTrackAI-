import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from "passport";
import User from '../models/User.js';
// import "../config/passport.js";
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Generate JWT
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // redirect frontend with token
    res.redirect(`http://localhost:5173/dashboard?token=${token}`);
  }
);

router.get("/check-email", async (req, res) => {
  const { email } = req.query;
  if (!email) return res.json({ exists: false });

  const user = await User.findOne({ email });
  res.json({ exists: !!user });
});


// @route   POST /api/auth/register
// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    // ❗STOP double hashing — let Mongoose do it
    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Registration failed' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN RECEIVED:", email, password);

    const user = await User.findOne({ email });
    console.log("USER FOUND:", user);

    if (!user) {
      console.log("USER NOT FOUND");
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", match);

    if (!match) {
      console.log("PASSWORD DID NOT MATCH");
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    console.log("LOGIN SUCCESS");

    res.json({ 
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Login failed' });
  }
});


// @route   POST /api/auth/logout
router.post('/logout', protect, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

console.log("ROUTER DEFINITION:", router.stack.map(r => r.route?.path));

export default router;
