// src/components/dashboard/RecurringBox.jsx
import { formatCurrency } from "../../utils/formatCurrency";

export default function RecurringBox({ items }) {
  return (
    <div className="recurring-box">
      <h3>Recurring Payments</h3>

      {!items || items.length === 0 && (
        <p className="muted-text">No recurring expenses detected yet.</p>
      )}

      {items && items.length > 0 && (
        <div className="recurring-list">
          {items.map((r) => (
            <div className="recur-row" key={r.id || r._id}>
              <div className="recur-main">
                <span className="recur-title">{r.title}</span>
                <span className="recur-amount">
                  {formatCurrency(r.amount || 0)}
                </span>
              </div>
              <div className="recur-meta">
                <span>
                  Next:{" "}
                  {r.nextDate
                    ? new Date(r.nextDate).toLocaleDateString("en-IN")
                    : "TBD"}
                </span>
                <span>Occurrences: {r.occurrences}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
