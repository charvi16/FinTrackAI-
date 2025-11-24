import Expense from "../models/Expense.js";
import User from "../models/User.js";
import { sendEmail } from "../utils/email.js";

export const sendMonthlyEmailReport = async() => {

  const users = await User.find();

  for(const user of users){

    const start = new Date();
    start.setDate(1);

    const expenses = await Expense.find({
      user:user._id,
      date:{ $gte:start }
    });

    const total = expenses.reduce((s,e)=>s+e.amount,0);

    await sendEmail(
      user.email,
      "📊 Monthly Spending Summary",
      `Hi ${user.name}, your total spending this month is ₹${total}.`
    );
  }
}
