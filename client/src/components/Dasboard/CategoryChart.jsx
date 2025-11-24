// src/components/dashboard/CategoryChart.jsx
import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#4b7bec", "#fd9644", "#2bcbba", "#fc5c65", "#a55eea", "#20bf6b"];

export default function CategoryChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="chart-card">
        <h3>Spending by Category</h3>
        <p className="muted-text">No expenses this month yet.</p>
      </div>
    );
  }

  return (
    <div className="chart-card">
      <h3>Spending by Category</h3>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              dataKey="total"
              nameKey="category"
              outerRadius={90}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
