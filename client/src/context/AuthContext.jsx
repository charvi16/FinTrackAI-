// src/context/AuthContext.jsx
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Auth loading during initialization

  const API = "http://localhost:5000/api";

  // --------------------------------------------------
  // Fetch logged-in user's profile
  // --------------------------------------------------
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("fintrack_token");

      if (!token) {
        setUser(null);
        return;
      }

      const res = await axios.get(`${API}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
    } catch (err) {
      console.log("❌ Fetch user failed:", err?.response?.data || err.message);
      setUser(null);
    }
  };

  // --------------------------------------------------
  // SIGN-UP
  // --------------------------------------------------
  const signup = async (name, email, password) => {
    const res = await axios.post(`${API}/auth/register`, {
      name,
      email,
      password,
    });

    localStorage.setItem("fintrack_token", res.data.token);
    await fetchUser();
  };

  // --------------------------------------------------
  // LOGIN
  // --------------------------------------------------
  const login = async (email, password) => {
    const res = await axios.post(`${API}/auth/login`, {
      email,
      password,
    });

    localStorage.setItem("fintrack_token", res.data.token);
    await fetchUser();
  };

  // --------------------------------------------------
  // LOGIN WITH GOOGLE TOKEN
  // --------------------------------------------------
  const loginWithToken = async (token) => {
    localStorage.setItem("fintrack_token", token);
    await fetchUser();
  };

  // --------------------------------------------------
  // LOGOUT
  // --------------------------------------------------
  const logout = () => {
    localStorage.removeItem("fintrack_token");
    setUser(null);
  };

  // --------------------------------------------------
  // INITIAL AUTH CHECK
  // --------------------------------------------------
  useEffect(() => {
    const init = async () => {
      await fetchUser();
      setLoading(false); // Only end loading after fetchUser completes
    };
    init();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user, // ⭐ FIXED: required for ProtectedRoute
        login,
        signup,
        logout,
        loginWithToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
