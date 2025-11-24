import Expense from '../models/Expense.js';
import { predictCategory } from '../services/aiClient.js';

function autoDetectCategoryViaRules(e){
  
  const m = e.merchant?.toLowerCase() || "";

  if(m.includes("zomato") || m.includes("swiggy")) return "Food";
  if(m.includes("uber") || m.includes("ola")) return "Transport";
  if(m.includes("paytm")) return "UPI Payment";

  if(m.includes("amazon")) return "Shopping";
  if(m.includes("mcd") || m.includes("kfc") || m.includes("pizza")) return "Food";
  
  if(e.amount < 200) return "Snacks";

  return "Uncategorized";
}

const addExpense = async (req, res) => {
  try {
    const { amount, description, category, date, paymentMode } = req.body;

    // Call AI if category not manually chosen
    let predictedCategory = null;
    let finalCategory = expense.category = autoDetectCategoryViaRules(expense);

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
      paymentMode,
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add expense' });
  }
};


export { addExpense };
