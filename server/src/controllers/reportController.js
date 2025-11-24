import pdfkit from "pdfkit";
import Expense from "../models/Expense.js";

export const generateMonthlyPDF = async(req, res) => {
  try{
    const user = req.user;

    const { start, end } = getCurrentMonthRange();

    const expenses = await Expense.find({
      user: user._id,
      date: { $gte:start, $lt:end }
    });

    const total = expenses.reduce((s,e) => s + e.amount, 0);

    const doc = new pdfkit();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition","inline; filename=report.pdf");

    doc.pipe(res);

    doc.fontSize(22).text("Fintrack AI – Monthly Report");
    doc.moveDown();
    
    doc.fontSize(12).text(`User: ${user.name}`);
    doc.text(`Month: ${start.toLocaleString('en-IN',{ month:'long'})}`);
    doc.text(`Total spent: ₹${total}`);
    doc.moveDown();

    doc.fontSize(16).text("Expenses:");
    doc.moveDown();

    expenses.forEach(e => {
      doc.text(`${e.category} - ₹${e.amount} - ${e.merchant}`);
    });

    doc.end();
  }
  catch(err){
    console.error(err)
    res.status(500).json({ message:"PDF failed"})
  }
}
