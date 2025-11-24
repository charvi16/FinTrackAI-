// src/context/ExpenseContext.jsx
import { createContext, useEffect, useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance.js";

const ExpenseContext = createContext(null);

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [expenseError, setExpenseError] = useState(null);

  const fetchExpenses = async (filters = {}) => {
    setLoadingExpenses(true);
    setExpenseError(null);
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await axiosInstance.get(`/expenses${params ? `?${params}` : ""}`);
      setExpenses(res.data.expenses || res.data);
    } catch (error) {
      console.error("Failed to fetch expenses", error?.response?.data || error.message);
      setExpenseError("Failed to load expenses.");
    } finally {
      setLoadingExpenses(false);
    }
  };

  const addExpense = async (expenseData) => {
    const res = await axiosInstance.post("/expenses", expenseData);
    const saved = res.data.expense || res.data;
    setExpenses((prev) => [saved, ...prev]);
    return saved;
  };

  const deleteExpense = async (id) => {
    await axiosInstance.delete(`/expenses/${id}`);
    setExpenses((prev) => prev.filter((e) => e._id !== id));
  };

  useEffect(() => {
    // you can choose to auto-load here when authenticated
    // fetchExpenses();
  }, []);

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        loadingExpenses,
        expenseError,
        fetchExpenses,
        addExpense,
        deleteExpense,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenseContext = () => useContext(ExpenseContext);
