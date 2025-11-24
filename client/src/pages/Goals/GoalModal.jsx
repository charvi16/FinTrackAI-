import { useState, useEffect } from "react";
import "./GoalsPage.css";
import axiosInstance from "../../api/axiosInstance";

export default function GoalModal({ goal, closeModal, refreshGoals }) {
  const [title, setTitle] = useState(goal.title || "");
  const [price, setPrice] = useState(goal.price || "");
  const [timeline, setTimeline] = useState(goal.timeline || "");
  const [category, setCategory] = useState(goal.category || "general");
  const [completed, setCompleted] = useState(goal.completed || false);
  const [progress, setProgress] = useState(goal.progress || 0);

  const [aiText, setAiText] = useState("");

  // Generate AI saving strategy locally (placeholder)
  useEffect(() => {
    if (!price || !timeline) return;

    const text = `
To buy "${title}" costing ₹${price} in ${timeline}, you can follow this plan:

1. Divide ₹${price} over ${timeline} → create a fixed monthly saving goal.
2. Reduce non-essential expenses by 10–15%.
3. Use automatic savings each month to stay consistent.
4. Avoid impulse purchases and track spending weekly.
5. Increase savings during higher-income months.

This plan ensures you achieve your goal without financial pressure.
    `;

    setAiText(text.trim());
  }, [title, price, timeline]);

  // ---- SAVE GOAL ----
  const handleSave = async () => {
    try {
      await axiosInstance.put(`/goals/${goal._id}`, {
        title,
        price,
        timeline,
        category,
        completed,
        progress,
        aiAdvice: aiText
      });

      refreshGoals();
      closeModal();
    } catch (err) {
      console.error("Failed to save goal:", err);
    }
  };

  // ---- DELETE GOAL ----
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/goals/${goal._id}`);
      refreshGoals();
      closeModal();
    } catch (err) {
      console.error("Failed to delete goal:", err);
    }
  };

  // ---- TOGGLE COMPLETED ----
  const handleComplete = async () => {
    try {
      const res = await axiosInstance.put(`/goals/${goal._id}/complete`);
      setCompleted(res.data.completed);
      refreshGoals();
    } catch (err) {
      console.error("Failed to toggle complete:", err);
    }
  };

  // Category icons
  const icons = {
    travel: "/goal-icons/travel.png",
    laptop: "/goal-icons/laptop.png",
    phone: "/goal-icons/phone.png",
    home: "/goal-icons/home.png",
    general: "/goal-icons/general.png",
  };

  return (
    <div className="goal-modal-overlay">
      <div className="goal-modal">

        <div className="goal-modal-header">
          <h2>Edit Goal</h2>
          <button className="delete-btn" onClick={handleDelete}>Delete</button>
        </div>

        {/* CATEGORY ICON */}
        <div className="goal-category-section">
          <img src={icons[category]} className="goal-modal-icon" alt="category" />
          <select
            className="goal-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="general">General</option>
            <option value="laptop">Laptop</option>
            <option value="travel">Travel</option>
            <option value="phone">Phone</option>
            <option value="home">Home</option>
          </select>
        </div>

        {/* FIELDS */}
        <div className="goal-field-row">
          <label>Title</label>
          <input
            placeholder="Goal title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="goal-field-row">
          <label>Price</label>
          <input
            type="number"
            placeholder="₹ Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="goal-field-row">
          <label>Timeline</label>
          <input
            placeholder="e.g. 6 months"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
          />
        </div>

        {/* PROGRESS */}
        <div className="goal-field-row">
          <label>Progress</label>
          <input
            type="number"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            placeholder="0-100%"
          />
        </div>

        {/* Visual Progress Bar */}
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        {/* Completed checkbox */}
        <div className="checkbox-row">
          <input type="checkbox" checked={completed} onChange={handleComplete} />
          <label>Mark goal as completed</label>
        </div>

        {/* AI saving strategy */}
        <div className="ai-text-box">
          <h4>AI Suggested Plan</h4>
          <p>{aiText}</p>
        </div>

        {/* Buttons */}
        <div className="goal-modal-buttons">
          <button className="cancel-btn" onClick={closeModal}>
            Close
          </button>
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
