import express from 'express';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import Expense from '../models/Expense.js';
import { protect } from '../middleware/authMiddleware.js';
import { predictCategory } from '../services/aiClient.js';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// @route   POST /api/expenses
router.post('/', protect, async (req, res) => {
  try {
    const { amount, description, category, date, mode } = req.body;

    let predictedCategory = null;
    let finalCategory = category;

    if (!category) {
      predictedCategory = await predictCategory({ amount, description });
      finalCategory = predictedCategory;
    }

    const expense = await Expense.create({
      userId: req.user._id,
      amount,
      description,
      category: finalCategory,
      predictedCategory,
      date: date ? new Date(date) : new Date(),
      mode,
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add expense' });
  }
});

// @route   GET /api/expenses
router.get('/', protect, async (req, res) => {
  try {
    const { from, to, category, mode } = req.query;
    const query = { userId: req.user._id };

    if (category) query.category = category;
    if (mode) query.mode = mode;
    if (from || to) query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);

    const expenses = await Expense.find(query).sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching expenses' });
  }
});

// @route   GET /api/expenses/:id
router.get('/:id', protect, async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense) return res.status(404).json({ message: 'Expense not found' });
  res.json(expense);
});

// @route   PUT /api/expenses/:id
router.put('/:id', protect, async (req, res) => {
  const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(expense);
});

// @route   DELETE /api/expenses/:id
router.delete('/:id', protect, async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.json({ message: 'Expense deleted' });
});

// @route   POST /api/expenses/bulk-upload
router.post('/bulk-upload', protect, upload.single('file'), async (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      await Expense.insertMany(results.map((r) => ({ ...r, userId: req.user._id })));
      fs.unlinkSync(req.file.path);
      res.json({ message: 'Bulk upload successful' });
    });
});

// @route   GET /api/expenses/summary
router.get('/summary', protect, async (req, res) => {
  const summary = await Expense.aggregate([
    { $match: { userId: req.user._id } },
    { $group: { _id: '$category', total: { $sum: '$amount' } } },
  ]);
  res.json(summary);
});

export default router;
