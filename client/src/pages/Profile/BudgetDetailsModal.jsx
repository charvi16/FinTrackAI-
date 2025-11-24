import "./ProfilePage.css";

export default function BudgetDetailsModal({ monthData, closeModal }) {
  if (!monthData) return null;

  return (
    <div className="overlay">
      <div className="budget-detail-modal">
        <button className="close-btn" onClick={closeModal}>×</button>

        <h2 className="month-label">{monthData.month} {monthData.year}</h2>

        <div className="detail-row month-label">
          <span>Budget:</span>
          <strong>₹{monthData.budget}</strong>
        </div>

        <div className="detail-row month-label">
          <span>Spent:</span>
          <strong>₹{monthData.spent}</strong>
        </div>

        <div className="detail-row month-label">
          <span>Saved:</span>
          <strong>₹{monthData.saved}</strong>
        </div>

        <div className="detail-row month-label">
          <span>Invested:</span>
          <strong>₹{monthData.invested}</strong>
        </div>
      </div>
    </div>
  );
}
