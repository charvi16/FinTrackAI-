// src/components/dashboard/AISnapshot.jsx
import Button from "../Button/Button";

export default function AISnapshot({ advice, onRegenerate, loading }) {
  return (
    <div className="dash-ai">
      <div className="dash-ai-header">
        <h3>AI Snapshot</h3>
        <Button
          variant="ghost"
          size="sm"
          disabled={loading}
          onClick={onRegenerate}
        >
          {loading ? "Thinking..." : "Regenerate"}
        </Button>
      </div>
      <div className="dash-ai-body">
        {advice ? (
          advice.split("\n").map((line, idx) => (
            <p key={idx}>{line}</p>
          ))
        ) : (
          <p className="muted-text">
            We’ll generate smart tips once you’ve added a few expenses.
          </p>
        )}
      </div>
    </div>
  );
}
