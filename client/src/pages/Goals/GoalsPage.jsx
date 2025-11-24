import { useState } from "react";
import "./GoalsPage.css";
import GoalCard from "./GoalCard";
import GoalModal from "./GoalModal";

export default function GoalsPage() {
  const [goals, setGoals] = useState([
    // { id: 1, title: "MacBook Pro", price: 150000, timeline: "6 months" },
    // { id: 2, title: "Travel to Europe", price: 200000, timeline: "1 year" }
  ]);

  const [openGoal, setOpenGoal] = useState(null);

  const addGoal = () => {
    const newGoal = {
      id: Date.now(),
      title: "New Goal",
      price: "",
      timeline: ""
    };
    setGoals([...goals, newGoal]);
  };

  return (
    <div className="goals-wrapper">
      <h1 className="goals-title">Your Goals</h1>

      <div className="goals-grid">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            onClick={() => setOpenGoal(goal)}
          />
        ))}

        <div className="goal-add-card" onClick={addGoal}>
          +
        </div>
      </div>

      {openGoal && (
        <GoalModal goal={openGoal} closeModal={() => setOpenGoal(null)} />
      )}
    </div>
  );
}
