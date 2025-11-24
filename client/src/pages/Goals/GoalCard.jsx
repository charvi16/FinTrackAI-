import "./GoalsPage.css";

export default function GoalCard({ goal, onClick }) {
  return (
    <div className="goal-card" onClick={onClick}>
      <h3>{goal.title}</h3>
    </div>
  );
}
