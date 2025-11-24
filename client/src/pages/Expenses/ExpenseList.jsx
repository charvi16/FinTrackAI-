// src/pages/Expenses/ExpenseList.jsx
import "./Expenses.css";
import { useEffect, useState } from "react";
import { useExpenseContext } from "../../context/ExpenseContext.jsx";
import { formatCurrency } from "../../utils/formatCurrency.js";
import { formatDate } from "../../utils/formatDate.js";
import Button from "../../components/Button/Button.jsx";
import { Link } from "react-router-dom";

export default function ExpenseList() {
  const { expenses, fetchExpenses, deleteExpense, loadingExpenses, expenseError } = useExpenseContext();
  const [filters, setFilters] = useState({
    from: "",
    to: "",
    category: "",
    mode: "",
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const applyFilters = () => {
    fetchExpenses(filters);
  };

  return (
    <section style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div className="exp-wrapper">
        <div className="exp-header">
          <div>
            <h2>Expenses</h2>
            <p>View, filter, and manage all your recorded expenses.</p>
          </div>
          <div className="exp-header-actions">
            <Link to="/expenses/new">
              <Button>Add Expense</Button>
            </Link>
          </div>
        </div>

        <div className="exp-list">
          <div className="exp-filter-bar">
            <input type="date" name="from" value={filters.from} onChange={handleChange} />
            <input type="date" name="to" value={filters.to} onChange={handleChange} />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={filters.category}
              onChange={handleChange}
            />
            <input
              type="text"
              name="mode"
              placeholder="Mode (UPI, Cash, Card)"
              value={filters.mode}
              onChange={handleChange}
            />
            <Button type="button" variant="ghost" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>

          <div className="exp-table-header">
            <div>Description</div>
            <div>Category</div>
            <div>Mode</div>
            <div>Amount</div>
            <div>Actions</div>
          </div>

          {loadingExpenses && <div className="exp-empty">Loading expenses...</div>}
          {expenseError && <div className="exp-empty">{expenseError}</div>}

          {!loadingExpenses && !expenseError && expenses.length === 0 && (
            <div className="exp-empty">No expenses recorded yet. Try adding one.</div>
          )}

          {!loadingExpenses &&
            !expenseError &&
            expenses.map((exp) => (
              <div className="exp-row" key={exp._id}>
                <div>
                  <strong>{exp.title || exp.description || "Expense"}</strong>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    {formatDate(exp.date)}
                  </div>
                </div>
                <div>{exp.category || "-"}</div>
                <div>{exp.mode || "-"}</div>
                <div
                  className={`exp-amount ${
                    exp.amount < 0 ? "exp-amount-negative" : "exp-amount-positive"
                  }`}
                >
                  {formatCurrency(exp.amount)}
                </div>
                <div>
                  <button
                    className="exp-delete-btn"
                    type="button"
                    onClick={() => deleteExpense(exp._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
