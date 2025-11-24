// src/pages/Auth/Signup.jsx
import "./Auth.css";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { validateEmail, validateRequired } from "../../utils/validateForm.js";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    if (!validateRequired(form.name) || !validateEmail(form.email) || !validateRequired(form.password)) {
      setErrorMsg("Please fill all fields with valid values.");
      return;
    }

    try {
      setSubmitting(true);
      await signup(form.name, form.email, form.password);
      navigate("/dashboard", {replace : true});
    } catch (error) {
      setErrorMsg(error?.response?.data?.message || "Could not create account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ width: "100%", display: "flex", justifyContent: "center" }}>
      <div className="auth-wrapper">
        <h2 className="auth-title">Create your FintrackAI account</h2>
        <p className="auth-subtitle">
          Start tracking your spending, budgets, and AI insights in minutes.
        </p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Charvi Agarwal"
            />
          </div>

          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
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
              placeholder="Minimum 6 characters"
            />
          </div>

          {errorMsg && <div className="auth-error">{errorMsg}</div>}

          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? "Creating account..." : "Sign up"}
          </Button>
        </form>

        {/* OR Divider */}
        <div className="auth-divider">
          <span></span> OR <span></span>
        </div>

        {/* Google Signup Button */}
        <button 
          className="google-btn"
          onClick={() => window.location.href = "http://localhost:5000/api/auth/google"}
        >
          <img src="/google-icon.png" alt="Google" />
          Continue with Google
        </button>


        <div className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </div>
    </section>
  );
}
