import { sendEmail } from "../utils/email.js";
import Expense from "../models/Expense.js";

export const overspendCheckHandler = async(req,res) => {
  const user = req.user;
  
  const total = await Expense.aggregate([
    { $match: { user:user._id }},
    { $group: { _id:null, total:{ $sum:"$amount"} } }
  ]);

  if(total > user.monthlyBudget){
     await sendEmail(
       user.email,
       "⚠ Budget Exceeded",
       "You've crossed your monthly budget. Reduce spending immediately."
     )
  }

  res.json({ ok:true })
};
