import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true },
    price: { type: Number, required: true },
    timeline: { type: String, required: true },

    category: { type: String, default: "general" }, // laptop, travel, home, phone etc.

    aiAdvice: { type: String, default: "" },

    completed: { type: Boolean, default: false },

    progress: { type: Number, default: 0 }, // 0 to 100
  },
  { timestamps: true }
);

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;
