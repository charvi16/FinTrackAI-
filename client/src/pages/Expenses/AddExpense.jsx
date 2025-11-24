// src/pages/Expenses/AddExpense.jsx
import "./Expenses.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useExpenseContext } from "../../context/ExpenseContext.jsx";
import Button from "../../components/Button/Button.jsx";

export default function AddExpense() {
  const { addExpense } = useExpenseContext();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    mode: "",
    date: "",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!form.title || !form.amount) {
      setErrorMsg("Title and amount are required.");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        ...form,
        amount: Number(form.amount),
      };
      await addExpense(payload);
      navigate("/expenses");
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Could not save expense.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div className="exp-wrapper">
        <div className="exp-header">
          <div>
            <h2>Add Expense</h2>
            <p>Record a new expense. AI categorization can be plugged in on the backend.</p>
          </div>
        </div>

        <div
          style={{
            background: "var(--card-bg)",
            borderRadius: "var(--radius-md)",
            padding: "3vh 2vw",
            border: "0.05rem solid var(--border-subtle)",
            boxShadow: "var(--shadow-soft)",
            maxWidth: "52vw",
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: "2vw",
            }}
          >
            <div className="auth-field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Grocery shopping"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="amount">Amount (₹)</label>
              <input
                id="amount"
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                placeholder="1200"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="category">Category</label>
              <input
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Food, Rent, Travel..."
              />
            </div>

            <div className="auth-field">
              <label htmlFor="mode">Payment Mode</label>
              <input
                id="mode"
                name="mode"
                value={form.mode}
                onChange={handleChange}
                placeholder="UPI, Card, Cash..."
              />
            </div>

            <div className="auth-field">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>

            <div className="auth-field" style={{ gridColumn: "1 / span 2" }}>
              <label htmlFor="notes">Notes</label>
              <input
                id="notes"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Optional details for this expense"
              />
            </div>

            {errorMsg && (
              <div className="auth-error" style={{ gridColumn: "1 / span 2" }}>
                {errorMsg}
              </div>
            )}

            <div style={{ gridColumn: "1 / span 2", marginTop: "2vh" }}>
              <Button type="submit" fullWidth disabled={submitting}>
                {submitting ? "Saving..." : "Save Expense"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
