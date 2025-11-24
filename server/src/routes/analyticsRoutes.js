import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import Expense from '../models/Expense.js';
import { forecastExpenses, detectAnomalies } from '../services/aiClient.js';

const router = express.Router();

// @route   GET /api/analytics/summary
router.get('/summary', protect, async (req, res) => {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

  const totalSpentThisMonth = await Expense.aggregate([
    { $match: { userId: req.user._id, date: { $gte: firstDay } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);

  res.json({
    totalSpentThisMonth: totalSpentThisMonth[0]?.total || 0,
  });
});

// @route   GET /api/analytics/trends
router.get('/trends', protect, async (req, res) => {
  const trends = await Expense.aggregate([
    { $match: { userId: req.user._id } },
    {
      $group: {
        _id: { month: { $month: '$date' }, year: { $year: '$date' } },
        total: { $sum: '$amount' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
  res.json(trends);
});

// @route   GET /api/analytics/by-category
router.get('/by-category', protect, async (req, res) => {
  const breakdown = await Expense.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
  ]);
  res.json(breakdown);
});

// @route   GET /api/analytics/forecast
router.get('/forecast', protect, async (req, res) => {
  const history = await Expense.find({ userId: req.user._id }).sort({ date: 1 });
  const forecast = await forecastExpenses(req.user._id, history);
  res.json(forecast);
});

// @route   GET /api/analytics/anomalies
router.get('/anomalies', protect, async (req, res) => {
  const expenses = await Expense.find({ userId: req.user._id });
  const anomalies = await detectAnomalies(req.user._id, expenses);
  res.json(anomalies);
});

export default router;
