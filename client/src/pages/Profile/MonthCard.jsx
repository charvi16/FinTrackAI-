import "./ProfilePage.css";

export default function MonthCard({ month, year, onClick }) {
  return (
    <div className="month-card" onClick={onClick}>
      <h3>{month} {year}</h3>
    </div>
  );
}
