import { useState } from "react";
import "./ProfilePage.css";

export default function AddMonthModal({ closeModal, addMonth }) {
  const [form, setForm] = useState({
    month: "",
    year: "",
    budget: "",
    spent: "",
    saved: "",
    invested: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.month || !form.year) return alert("Please fill month & year");

    addMonth({
      month: form.month,
      year: Number(form.year),
      budget: Number(form.budget) || 0,
      spent: Number(form.spent) || 0,
      invested: Number(form.invested) || 0,
      saved: Number(form.saved) || 0,
    });

    closeModal();
  };

  return (
    <div className="overlay">
      <div className="add-month-modal">

        <button className="close-btn" onClick={closeModal}>
          ×
        </button>

        <h2 className="month-h2">Add Month Budget</h2>

        <div className="modal-input-wrapper">
          <label className="month-label">Month</label>
          <input
            type="text"
            name="month"
            placeholder="e.g. November"
            onChange={handleChange}
          />
        </div>

        <div className="modal-input-wrapper">
          <label className="month-label">Year</label>
          <input
            type="number"
            name="year"
            placeholder="2025"
            onChange={handleChange}
          />
        </div>

        <div className="modal-input-wrapper">
          <label className="month-label">Monthly Budget</label>
          <input
            type="number"
            name="budget"
            placeholder="₹"
            onChange={handleChange}
          />
        </div>

        <div className="modal-input-wrapper">
          <label className="month-label">Spent</label>
          <input
            type="number"
            name="spent"
            placeholder="₹"
            onChange={handleChange}
          />
        </div>

        <div className="modal-input-wrapper">
          <label className="month-label">Saved</label>
          <input
            type="number"
            name="saved"
            placeholder="₹"
            onChange={handleChange}
          />
        </div>

        <div className="modal-input-wrapper">
          <label className="month-label">Invested</label>
          <input
            type="number"
            name="invested"
            placeholder="₹"
            onChange={handleChange}
          />
        </div>

        <button className="modal-submit-btn" onClick={handleSubmit}>
          Add Month
        </button>
      </div>
    </div>
  );
}
