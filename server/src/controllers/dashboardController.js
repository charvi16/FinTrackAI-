// server/src/controllers/dashboardController.js
import Expense from '../models/Expense.js';
import Groq from 'groq-sdk';

const groqClient =
  process.env.GROQ_API_KEY
    ? new Groq({ apiKey: process.env.GROQ_API_KEY })
    : null;

// Helper: get current month range
function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return { start, end };
}

// GET /api/dashboard/stats/categories
export const getCategoryStats = async (req, res) => {
  try {
    const { start, end } = getCurrentMonthRange();

    const agg = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    res.json(agg);
  } catch (err) {
    console.error('getCategoryStats error:', err);
    res.status(500).json({ message: 'Failed to fetch category stats' });
  }
};

// GET /api/dashboard/stats/monthly  (last 6 months)
export const getMonthlyStats = async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const agg = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: sixMonthsAgo, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          year: '$_id.year',
          month: '$_id.month',
          total: 1,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ]);

    // Shape for chart: [{ label: "Nov 2025", total: 12345 }]
    const result = agg.map((item) => {
      const date = new Date(item.year, item.month - 1, 1);
      const label = date.toLocaleString('en-US', { month: 'short', year: '2-digit' });
      return { label, total: item.total };
    });

    res.json(result);
  } catch (err) {
    console.error('getMonthlyStats error:', err);
    res.status(500).json({ message: 'Failed to fetch monthly stats' });
  }
};

// Simple recurring detection:
// same merchant & similar amount appearing >= 3 times in last 6 months
// GET /api/dashboard/recurring
export const getRecurring = async (req, res) => {
  try {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const agg = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: sixMonthsAgo, $lte: now },
          merchant: { $ne: null },
        },
      },
      {
        $group: {
          _id: { merchant: '$merchant', amount: '$amount' },
          count: { $sum: 1 },
          lastDate: { $max: '$date' },
        },
      },
      {
        $match: {
          count: { $gte: 3 },
        },
      },
      {
        $project: {
          _id: 0,
          merchant: '$_id.merchant',
          amount: '$_id.amount',
          count: 1,
          lastDate: 1,
        },
      },
      { $sort: { amount: -1 } },
    ]);

    const result = agg.map((item, index) => {
      const nextDate = new Date(item.lastDate);
      nextDate.setMonth(nextDate.getMonth() + 1);

      return {
        id: index,
        title: item.merchant,
        amount: item.amount,
        occurrences: item.count,
        lastDate: item.lastDate,
        nextDate,
      };
    });

    res.json(result);
  } catch (err) {
    console.error('getRecurring error:', err);
    res.status(500).json({ message: 'Failed to fetch recurring payments' });
  }
};

// GET /api/dashboard/ai/snapshot
export const getAiSnapshot = async (req, res) => {
  try {
    const { start, end } = getCurrentMonthRange();

    const expenses = await Expense.aggregate([
      {
        $match: {
          user: req.user._id,
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
        },
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          total: 1,
        },
      },
      { $sort: { total: -1 } },
    ]);

    const totalSpent = expenses.reduce((s, e) => s + e.total, 0);

    // fallback if no GROQ key
    if (!groqClient) {
      const top = expenses[0]?.category || 'top categories';
      const msg = `You spent ₹${totalSpent}. Reduce ${top} by 5-10% & auto save that money.`;
      return res.json({ advice: msg });
    }

    const summaryText = expenses
      .map((e) => `${e.category}: ₹${e.total}`)
      .join(", ");

    const prompt = `
You are a concise Indian financial advisor.

Summary:
${summaryText}

Total: ₹${totalSpent}

Give actionable budget advice in 3 bullet points.
Short.
Practical.
Under 90 words.
No disclaimers.
`;

    const completion = await groqClient.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const advice = completion.choices[0].message.content;

    res.json({ advice });
  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({ message: "AI failed" });
  }
};
