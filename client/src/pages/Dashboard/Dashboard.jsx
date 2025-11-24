// src/pages/Dashboard/Dashboard.jsx
import "./Dashboard.css";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../hooks/useAuth.js";
import { useExpenseContext } from "../../context/ExpenseContext.jsx";
import Button from "../../components/Button/Button.jsx";
import { Link } from "react-router-dom";
import { formatCurrency } from "../../utils/formatCurrency.js";

import ProgressBar from "../../components/Dasboard/ProgressBar.jsx";
import RecurringBox from "../../components/Dasboard/RecurringBox.jsx";
import CategoryChart from "../../components/Dasboard/CategoryChart.jsx";
import TrendChart from "../../components/Dasboard/TrendChart.jsx";
import AISnapshot from "../../components/Dasboard/AISnapshot.jsx";

export default function Dashboard() {
  const { user } = useAuth();
  const { expenses, fetchExpenses } = useExpenseContext();

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [categoryStats, setCategoryStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [recurring, setRecurring] = useState([]);
  const [aiAdvice, setAiAdvice] = useState("");

  // Helper: get auth token (adjust if you store differently)
  const token = localStorage.getItem("token");

  const authedFetch = async (url) => {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return res.json();
  };

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await fetchExpenses();

        const [cat, monthly, recur, ai] = await Promise.all([
          authedFetch("/api/dashboard/stats/categories"),
          authedFetch("/api/dashboard/stats/monthly"),
          authedFetch("/api/dashboard/recurring"),
          authedFetch("/api/dashboard/ai/snapshot"),
        ]);

        setCategoryStats(cat || []);
        setMonthlyStats(monthly || []);
        setRecurring(recur || []);
        setAiAdvice(ai?.advice || "");
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const regenerateAi = async () => {
    try {
      setAiLoading(true);
      const ai = await authedFetch("/api/dashboard/ai/snapshot");
      setAiAdvice(ai?.advice || "");
    } catch (err) {
      console.error("AI snapshot error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  const summary = useMemo(() => {
    const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);
    const income = user?.income || 0;
    const budget = user?.monthlyBudget || 0;
    const remaining = budget > 0 ? budget - total : 0;
    const savingsRate = income > 0 ? ((income - total) / income) * 100 : 0;

    return {
      total,
      income,
      budget,
      remaining,
      savingsRate: Math.max(0, Math.round(savingsRate)),
    };
  }, [expenses, user]);

  return (
    <section className="dash">
      <div className="dash-inner">
        <div className="dash-header">
          <div>
            <h2>Hey {user?.name || "there"} 👋</h2>
            <p>Here’s a quick overview of your month with FintrackAI.</p>
          </div>
          <div className="dash-header-actions">
            <Link to="/expenses/new">
              <Button>Add Expense</Button>
            </Link>
            <Link to="/reports">
              <Button variant="ghost">View Reports</Button>
            </Link>
          </div>
        </div>

        {/* Top summary cards */}
        <div className="dash-grid">
          <div className="dash-card">
            <span className="dash-card-label">Total Spent</span>
            <span className="dash-card-value">
              {formatCurrency(summary.total)}
            </span>
          </div>
          <div className="dash-card">
            <span className="dash-card-label">Monthly Budget</span>
            <span className="dash-card-value">
              {summary.budget ? formatCurrency(summary.budget) : "Not set"}
            </span>
          </div>
          <div className="dash-card">
            <span className="dash-card-label">Budget Remaining</span>
            <span
              className="dash-card-value"
              style={{
                color:
                  summary.remaining < 0
                    ? "var(--danger)"
                    : "var(--accent)",
              }}
            >
              {formatCurrency(summary.remaining)}
            </span>
          </div>
          <div className="dash-card">
            <span className="dash-card-label">Savings Rate</span>
            <span className="dash-card-value">
              {summary.savingsRate}%
            </span>
          </div>
        </div>

        {/* Budget progress bar */}
        <ProgressBar spent={summary.total} budget={summary.budget} />

        {/* Charts row */}
        <div className="dash-charts-row">
          <CategoryChart data={categoryStats} />
          <TrendChart data={monthlyStats} />
        </div>

        {/* Bottom section: AI + Recurring + Quick links */}
        <div className="dash-bottom">
          <AISnapshot
            advice={aiAdvice}
            onRegenerate={regenerateAi}
            loading={aiLoading}
          />

          <div className="dash-side">
            <RecurringBox items={recurring} />

            <div className="dash-quick">
              <h3>Quick Links</h3>
              <div className="dash-quick-grid">
                <Link to="/expenses" className="dash-quick-pill">
                  View all expenses
                </Link>
                <Link to="/expenses/new" className="dash-quick-pill">
                  Add a new expense
                </Link>
                <Link to="/reports" className="dash-quick-pill">
                  Monthly reports
                </Link>
                <a
                  href="/api/reports/pdf"
                  className="dash-quick-pill"
                  target="_blank"
                  rel="noreferrer"
                >
                  Export PDF Report
                </a>
              </div>
            </div>
          </div>
        </div>

        {loading && (
          <p
            style={{
              marginTop: "2vh",
              color: "var(--text-secondary)",
            }}
          >
            Refreshing data...
          </p>
        )}
      </div>
    </section>
  );
}
