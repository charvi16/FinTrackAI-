import User from "../models/User.js";
import Expense from "../models/Expense.js";
import Groq from "groq-sdk";
import { sendEmail } from "../utils/email.js";

const groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const sendMonthlyPrediction = async() => {

  const users = await User.find();

  for(const user of users){

    const expenses = await Expense.find({ user:user._id });

    const total = expenses.reduce((s,e)=>s+e.amount,0);

    const prompt = `
Predict the user's upcoming month spending.
They spent ₹${total} in total historically.
Provide short realistic prediction in human language.
`;

    const ai = await groqClient.chat.completions.create({
      model:"llama3-70b-8192",
      messages:[{ role:"user", content:prompt }]
    });

    await sendEmail(
      user.email,
      "🤖 Financial Prediction For Next Month",
      ai.choices[0].message.content
    );
  }
}
