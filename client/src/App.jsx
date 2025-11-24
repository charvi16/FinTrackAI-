import "./App.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ExpenseProvider } from "./context/ExpenseContext.jsx";
import Loader from "./components/Loader/Loader";
import AppRouter from "./router/AppRouter.jsx";
import { useAuth } from "./hooks/useAuth.js";

function AppContent() {
  const { loading } = useAuth();

  if (loading) return <Loader />;

  return <AppRouter />;
}

export default function App() {
  return (
    <AuthProvider>
      <ExpenseProvider>
        <AppContent />
      </ExpenseProvider>
    </AuthProvider>
  );
}
