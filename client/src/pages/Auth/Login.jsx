// src/pages/Auth/Login.jsx
import "./Auth.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import axios from "axios";
import { validateEmail, validateRequired } from "../../utils/validateForm.js";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [emailExists, setEmailExists] = useState(false);

  const API = "http://localhost:5000/api/auth";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const checkEmail = async () => {
    if (!validateEmail(form.email)) return;
    try {
      const res = await axios.get(`${API}/check-email?email=${form.email}`);
      setEmailExists(res.data.exists);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!validateEmail(form.email) || !validateRequired(form.password)) {
      setErrorMsg("Please enter a valid email and password.");
      return;
    }

    try {
      setSubmitting(true);
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Invalid credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div className="auth-wrapper">
        <h2 className="auth-title">Welcome back 👋</h2>
        <p className="auth-subtitle">Log in to see your AI-powered finance dashboard.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onBlur={checkEmail}
              placeholder="you@example.com"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          {errorMsg && <div className="auth-error">{errorMsg}</div>}

          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? "Logging in..." : "Login"}
          </Button>
        </form>

        {/* SHOW GOOGLE LOGIN ONLY IF EMAIL EXISTS */}
        {emailExists && (
          <button
            className="google-btn"
            style={{ marginTop: "15px" }}
            onClick={() =>
              window.location.href = `http://localhost:5000/api/auth/google?email=${form.email}`
            }
          >
            <img src="/google-icon.png" alt="Google" />
            Continue with Google
          </button>
        )}

        <div className="auth-footer">
          New to FintrackAI? <Link to="/signup">Create an account</Link>
        </div>
      </div>
    </section>
  );
}
