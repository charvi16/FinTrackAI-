import Expense from "../models/Expense.js";

export const detectSIP = async(user) => {

  const expenses = await Expense.find({
    user:user._id,
    category:"Investment"
  });

  if(expenses.length < 3) return null;

  return {
    probableAmount: expenses[0].amount,
    frequency:"Monthly"
  }
}
