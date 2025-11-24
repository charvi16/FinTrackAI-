import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    predictedCategory: { type: String },
    description: { type: String },
    date: { type: Date, required: true },
    mode: { type: String },
    receiptUrl: { type: String },
    isAnomaly: { type: Boolean, default: false },
    source: { type: String },
  },
  { timestamps: true }
);

const Expense = mongoose.model('Expense', expenseSchema);
export default Expense;
