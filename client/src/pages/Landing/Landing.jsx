// src/pages/Landing/Landing.jsx

import "./Landing.css";
import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button/Button";

export default function Landing() {
  const [openFAQ, setOpenFAQ] = useState(null);

  const toggleFAQ = (i) => {
    setOpenFAQ(openFAQ === i ? null : i);
  };
  return (
    <section className="landing">
      <div className="landing-inner">

        {/* HERO */}
        <div className="landing-hero">
          <h1>
            Smart finance, <span>backed by AI.</span>
          </h1>
          <p className="landing-desc">
            Your personal finance command-center — track spending, forecast cash flow,
            and make smarter money decisions with FintrackAI.
          </p>

          <div className="landing-cta">
            <Link to="/signup">
              <Button fullWidth={false}>Get Started Free</Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost">I already have an account</Button>
            </Link>
          </div>

          <div className="landing-highlight">
            <div>
              <strong>Real-time insights</strong>
              <span>See where your money goes, instantly.</span>
            </div>
            <div>
              <strong>AI-powered categories</strong>
              <span>Smart tagging for every transaction.</span>
            </div>
          </div>
        </div>

        {/* DASHBOARD PREVIEW */}
        <div className="landing-preview">
          <div className="landing-card">...</div>
        </div>
      </div>

      {/* ⭐ SECTION 1 — Motto */}
      <section className="motto-section">
        <h2>Designed for everyone.</h2>
        <p>
          Whether you're a student, a working professional, or a business owner —
          FintrackAI helps you take better control of your money.
        </p>

        <div className="motto-grid">
          <div>
            <strong>Plan better</strong>
            <span>Track spending with zero effort.</span>
          </div>
          <div>
            <strong>Decide smarter</strong>
            <span>Use AI financial forecasts.</span>
          </div>
          <div>
            <strong>Save more</strong>
            <span>Identify waste and grow savings.</span>
          </div>
        </div>
      </section>

      {/* ⭐ SECTION 2 — Trusted By */}
      <section className="trusted-section">
        <h2>Trusted by people who want financial clarity.</h2>
        <div className="trusted-logos">
          <span className="t-logo">10k+ Users</span>
          <span className="t-logo">4.9★ Rating</span>
          <span className="t-logo">Secure & Encrypted</span>
          <span className="t-logo">AI Verified</span>
        </div>
      </section>

      {/* ⭐ SECTION 3 — Client Reviews */}
      <section className="reviews-section">
        <h2>What people are saying</h2>
        <div className="reviews-grid">
          <div className="review">
            “FintrackAI helped me cut my monthly spending by 20% without stress.”
            <strong>— Ayesha, Student</strong>
          </div>
          <div className="review">
            “The AI predictions are insanely accurate. I finally understand my money.”
            <strong>— Raghav, Software Engineer</strong>
          </div>
          <div className="review">
            “A must-have tool for anyone who wants to save more and spend wisely.”
            <strong>— Priya, Consultant</strong>
          </div>
        </div>
      </section>

      {/* ⭐ SECTION 4 — Making Headlines */}
      <section className="press-section">
        <h2>Making Headlines</h2>
        <div className="press-logos">
          <span className="press-logo">TechDaily</span>
          <span className="press-logo">FinanceWire</span>
          <span className="press-logo">AI Times</span>
          <span className="press-logo">MoneyWatch</span>
        </div>
      </section>

      {/* ⭐ SECTION 5 — FAQ */}
      <section className="faq-section">
          <h2>Frequently Asked Questions</h2>

          {[
            {
              q: "Is FintrackAI free to use?",
              a: "Yes, the basic version is completely free."
            },
            {
              q: "Is my data secure?",
              a: "Your data is encrypted end-to-end and never shared with anyone."
            },
            {
              q: "How do AI predictions work?",
              a: "Our models learn from your spending history and generate highly accurate 30–90 day forecasts."
            }
          ].map((item, index) => (
            <div className="faq-item" key={index}>
              <button
                className="faq-question"
                onClick={() => toggleFAQ(index)}
              >
                <span>{item.q}</span>
                <span className={`faq-arrow ${openFAQ === index ? "open" : ""}`}>
                  ^
                </span>
              </button>

              <div className={`faq-answer ${openFAQ === index ? "show" : ""}`}>
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </section>


      {/* ⭐ SECTION 6 — Ready To Get Started */}
      <section className="start-section">
        <h2>Ready to take control of your finances?</h2>
        <p>Join thousands of users building a smarter relationship with money.</p>
        <Link to="/signup">
          <Button fullWidth={false}>Get Started — It’s Free</Button>
        </Link>
      </section>

    </section>
  );
}
