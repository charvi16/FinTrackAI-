// src/pages/Reports/Reports.jsx
import "./Reports.css";
import { useEffect } from "react";
import { useFetch } from "../../hooks/useFetch.js";
import { formatCurrency } from "../../utils/formatCurrency.js";

export default function Reports() {
  const { data, loading, error, execute } = useFetch("/reports/summary", {}, false);

  useEffect(() => {
    execute();
  }, []);

  const summary = data?.summary || data || {};

  return (
    <section className="rep">
      <div className="rep-inner">
        <div className="rep-header">
          <div>
            <h2>Reports</h2>
            <p>Deep dive into your monthly and category-wise insights.</p>
          </div>
        </div>

        <div className="rep-grid">
          <div className="rep-card">
            <h3>Monthly Summary</h3>
            {loading && <p>Loading reports...</p>}
            {error && <p style={{ color: "var(--danger)" }}>Could not load reports.</p>}
            {!loading && !error && (
              <div className="rep-metrics">
                <div>
                  <span className="label">Total Spent</span>
                  <span className="value">
                    {formatCurrency(summary.totalSpent || 0)}
                  </span>
                </div>
                <div>
                  <span className="label">Highest Category</span>
                  <span className="value">
                    {summary.topCategory || "Not enough data"}
                  </span>
                </div>
                <div>
                  <span className="label">Transactions</span>
                  <span className="value">
                    {summary.count || 0}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="rep-card">
            <h3>AI Recommendations</h3>
            <p>
              This section can be fed directly from your ML backend. For now, plug in
              generated tips like:
            </p>
            <ul className="rep-list">
              <li>“Reduce dining out by 10% to hit your savings goal.”</li>
              <li>“Move recurring payments closer to your salary date.”</li>
              <li>“Set alerts for spends above a threshold.”</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
