import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import { updateProfile } from '../controllers/userController.js';

const router = express.Router();

// @route   GET /api/users/me
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

router.put("/me", protect, updateProfile);

// @route   POST /api/users/me/goal
router.post('/me/goal', protect, async (req, res) => {
  try {
    const { monthlyBudget } = req.body;
    req.user.monthlyBudget = monthlyBudget;
    await req.user.save();
    res.json({ message: 'Monthly budget goal updated', monthlyBudget });
  } catch (err) {
    res.status(500).json({ message: 'Goal update failed' });
  }
});

export default router;
