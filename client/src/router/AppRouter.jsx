// src/router/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "../pages/Landing/Landing.jsx";
import Login from "../pages/Auth/Login.jsx";
import Signup from "../pages/Auth/Signup.jsx";
import Dashboard from "../pages/Dashboard/Dashboard.jsx";
import ExpenseList from "../pages/Expenses/ExpenseList.jsx";
import AddExpense from "../pages/Expenses/AddExpense.jsx";
import Reports from "../pages/Reports/Reports.jsx";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer/Footer.jsx";
import ProfilePage from "../pages/Profile/ProfilePage.jsx";
import GoalsPage from "../pages/Goals/GoalsPage.jsx";
import CalculatorPage from "../pages/Calculator/CalculatorPage.jsx";
import { useAuth } from "../hooks/useAuth.js";

// ⭐ FIXED & CLEAN PROTECTED ROUTE
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  // ⛔ Don’t redirect while loading auth state
  if (loading) return null;

  // ⛔ If user not authenticated -> redirect to login
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // ✔ Authenticated -> allow the route
  return children;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />

      <main
        style={{
          flex: 1,
          width: "100vw",
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          padding: "6vh 4vw",
        }}
      >
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/expenses"
            element={
              <ProtectedRoute>
                <ExpenseList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/expenses/new"
            element={
              <ProtectedRoute>
                <AddExpense />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <GoalsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/calculator"
            element={
              <ProtectedRoute>
                <CalculatorPage />
              </ProtectedRoute>
            }
          />

          {/* UNKNOWN PATHS -> REDIRECT TO HOME */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}
