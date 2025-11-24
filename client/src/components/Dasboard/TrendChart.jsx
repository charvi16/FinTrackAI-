// src/components/dashboard/TrendChart.jsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function TrendChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h3>Monthly Spending Trend</h3>
        <p className="muted-text">We’ll show a trend once you have some history.</p>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3>Monthly Spending Trend</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip
              formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`}
            />
            <Line type="monotone" dataKey="total" stroke="#4b7bec" dot />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
