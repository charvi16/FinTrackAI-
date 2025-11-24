import mongoose from 'mongoose';

const monthlySchema = new mongoose.Schema(
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
  },
  { timestamps: true }
);

const Monthly = mongoose.model('Monthly', monthlySchema);
export default Monthly;
