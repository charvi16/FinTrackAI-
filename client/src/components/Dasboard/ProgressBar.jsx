// src/components/dashboard/ProgressBar.jsx
// import "./ProgressBar.css"; 

export default function ProgressBar({ spent, budget }) {
  if (!budget || budget <= 0) {
    return (
      <div className="dash-budget-progress">
        <div className="label-row">
          <span>Monthly Progress</span>
          <strong>Set a budget to track</strong>
        </div>
      </div>
    );
  }

  const percent = Math.min(100, Math.round((spent / budget) * 100));
  const status = spent > budget ? "Overspent" : "On Track";

  return (
    <div className="dash-budget-progress">
      <div className="label-row">
        <span>Monthly Progress</span>
        <strong>{status}</strong>
      </div>

      <div className="progress-outer">
        <div
          className={`progress-inner ${
            spent > budget ? "progress-danger" : "progress-ok"
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="progress-footer">
        <span>{percent}% of ₹{budget.toLocaleString("en-IN")} used</span>
      </div>
    </div>
  );
}
