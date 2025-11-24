import { sendEmail } from "../utils/email.js";
import pdfkit from "pdfkit";
import Expense from "../models/Expense.js";
import User from "../models/User.js";
import { Readable } from "stream";

export const sendPDFToUsers = async() => {
  
  const users = await User.find();

  for(const user of users){

    const expenses = await Expense.find({ user:user._id });

    // generate PDF to buffer
    const doc = new pdfkit();

    let chunks = [];
    doc.on("data", (d)=>chunks.push(d));
    doc.on("end", async()=>{
      const pdfBuffer = Buffer.concat(chunks);

      await sendEmail(
        user.email,
        "📎 Monthly PDF Report",
        "Attached is your monthly finance summary",
        pdfBuffer
      )
    });

    doc.text("Fintrack Monthly PDF");
    doc.moveDown();
    expenses.forEach(e=>doc.text(`${e.category} – ₹${e.amount}`));
    doc.end();
  }
}
