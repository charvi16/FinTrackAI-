import { useState } from "react";
import axios from "axios";
import "./EmergencyFundCalculator.css";

export default function EmergencyFundCalculator() {
  const [form, setForm] = useState({
    essentialExpenses: "",
    jobRisk: "medium",
    dependents: 0,
    insuranceCoverage: true,
    upcomingExpenses: 0,
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const calculate = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/finance/emergency-fund",
        form
      );
      setResult(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="ef-container">
      <h2 className="ef-title">Emergency Fund Calculator</h2>

      <label className="ef-label">Monthly Essential Expenses (₹)</label>
      <input
        type="number"
        name="essentialExpenses"
        value={form.essentialExpenses}
        onChange={handleChange}
        className="ef-input"
      />

      <label className="ef-label">Job Stability</label>
      <select
        name="jobRisk"
        value={form.jobRisk}
        onChange={handleChange}
        className="ef-input"
      >
        <option value="low">Low (Govt / Very Stable)</option>
        <option value="medium">Medium (Private)</option>
        <option value="high">High (Self-employed / High-Risk)</option>
      </select>

      <label className="ef-label">Dependents</label>
      <input
        type="number"
        name="dependents"
        value={form.dependents}
        onChange={handleChange}
        className="ef-input"
      />

      <label className="ef-label">Insurance Coverage?</label>
      <select
        name="insuranceCoverage"
        value={form.insuranceCoverage}
        onChange={handleChange}
        className="ef-input"
      >
        <option value={true}>Yes</option>
        <option value={false}>No</option>
      </select>

      <label className="ef-label">Upcoming Big Expenses (₹)</label>
      <input
        type="number"
        name="upcomingExpenses"
        value={form.upcomingExpenses}
        onChange={handleChange}
        className="ef-input"
      />

      <button className="ef-btn" onClick={calculate}>
        Calculate
      </button>

      {result && (
        <div className="ef-result-box">
          <h3 className="ef-result-title">Result</h3>
          <p>Total Months Required: {result.totalMonths}</p>
          <p className="ef-fund">Emergency Fund: ₹{result.emergencyFundNeeded}</p>
          <p className="ef-summary">{result.summary}</p>
        </div>
      )}
    </div>
  );
}
