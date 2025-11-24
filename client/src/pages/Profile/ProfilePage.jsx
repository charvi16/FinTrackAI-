import { useState, useEffect } from "react";
import "./ProfilePage.css";
import MonthCard from "./MonthCard.jsx";
import BudgetDetailsModal from "./BudgetDetailsModal.jsx";
import AddMonthModal from "./AddMonthModal.jsx";
import { useAuth } from "../../hooks/useAuth";

export default function ProfilePage() {
  const { user } = useAuth();
  const [openModal, setOpenModal] = useState(false);
  const [showAddMonthModal, setShowAddMonthModal] = useState(false);

  // Local month budgets — ideally you fetch this from backend
  const [months, setMonths] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

  // Get current month + year
  const date = new Date();
  const currentMonth = date.toLocaleString("en-US", { month: "long" });
  const currentYear = date.getFullYear();

  // Add current month on first load (if not added)
  useEffect(() => {
    setMonths((prev) => {
      const exists = prev.some(
        (m) => m.month === currentMonth && m.year === currentYear
      );
      if (!exists) {
        return [
          ...prev,
          {
            month: currentMonth,
            year: currentYear,
            budget: user?.monthlyBudget || 0,
            spent: user?.stats?.monthlySpent || 0,
            invested: user?.stats?.monthlyInvested || 0,
            saved: Math.max((user?.monthlyBudget || 0) - (user?.stats?.monthlySpent || 0), 0)
          }
        ];
      }
      return prev;
    });
  }, [user]);

  // Sort months oldest → newest (October before November)
  const sortedMonths = [...months].sort((a, b) => {
    const d1 = new Date(`${a.month} ${a.year}`);
    const d2 = new Date(`${b.month} ${b.year}`);
    return d1 - d2;
  });

  return (
    <div className="profile-wrapper">

      {openModal && <EditProfileModal closeModal={() => setOpenModal(false)} />}

      {selectedMonth && (
        <BudgetDetailsModal
          monthData={selectedMonth}
          closeModal={() => setSelectedMonth(null)}
        />
      )}

      {showAddMonthModal && (
  <AddMonthModal
    closeModal={() => setShowAddMonthModal(false)}
    addMonth={(newMonthData) => {
      setMonths((prev) => [...prev, newMonthData]);
    }}
  />
)}


      {/* Profile Header */}
      <div className="profile-box">
        <img
          src={user?.image || "/default-user.png"}
          className="profile-main-img"
          alt="profile"
        />

        <h2 className="profile-username">{user?.name}</h2>

        <button className="profile-edit-btn" onClick={() => setOpenModal(true)}>
          Edit Profile
        </button>
      </div>

      {!selectedMonth && (
        <div className="months-container">
          {sortedMonths.map((m, i) => (
            <MonthCard
              key={i}
              month={m.month}
              year={m.year}
              onClick={() => setSelectedMonth(m)}
            />
          ))}

          <div
            className="add-month-card"
            onClick={() => setShowAddMonthModal(true)}
          >
            +
          </div>
        </div>
      )}
    </div>
  );
}
