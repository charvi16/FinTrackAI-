import Expense from '../models/Expense.js';
import { forecastExpenses, detectAnomalies } from '../services/aiClient.js';

// @desc    Summary analytics (total spent, category breakdown)
// @route   GET /api/analytics/summary
// @access  Private
const getSummary = async (req, res) => {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

    const thisMonth = await Expense.aggregate([
      { $match: { userId: req.user._id, date: { $gte: firstDay } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const byCategory = await Expense.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);

    res.json({
      totalSpentThisMonth: thisMonth[0]?.total || 0,
      categoryBreakdown: byCategory,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to load summary' });
  }
};

// @desc    Monthly spending trends
// @route   GET /api/analytics/trends
const getTrends = async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ message: 'Failed to load trends' });
  }
};

// @desc    Category breakdown (pie chart)
// @route   GET /api/analytics/by-category
const getByCategory = async (req, res) => {
  try {
    const breakdown = await Expense.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]);
    res.json(breakdown);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load category data' });
  }
};

// @desc    Forecast next month expenses using AI
// @route   GET /api/analytics/forecast
const getForecast = async (req, res) => {
  try {
    const history = await Expense.find({ userId: req.user._id }).sort({ date: 1 });
    const forecast = await forecastExpenses(req.user._id, history);
    res.json(forecast);
  } catch (err) {
    res.status(500).json({ message: 'Failed to forecast' });
  }
};

// @desc    Detect anomalies using AI
// @route   GET /api/analytics/anomalies
const getAnomalies = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user._id });
    const anomalies = await detectAnomalies(req.user._id, expenses);
    res.json(anomalies);
  } catch (err) {
    res.status(500).json({ message: 'Failed to detect anomalies' });
  }
};

export { getSummary, getTrends, getByCategory, getForecast, getAnomalies };
