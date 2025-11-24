// src/pages/Landing/Landing.jsx
import "./Landing.css";
import { Link } from "react-router-dom";
// import Button from "../../components/Button/Button.jsx";
import Button from '../../components/Button/Button';

export default function Landing() {
  return (
    <section className="landing">
      <div className="landing-inner">
        <div className="landing-hero">
          <h1>
            Smart finance, <span>backed by AI.</span>
          </h1>
          <p>
            FintrackAI helps you track every rupee, forecast future spending, and
            stay ahead of surprise expenses — automatically.
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

        <div className="landing-preview">
          <div className="landing-card">
            <div className="landing-card-header">
              <span>Monthly Overview</span>
              <span className="pill pill-positive">+12.4% better</span>
            </div>
            <div className="landing-stats">
              <div>
                <span className="label">Total Spent</span>
                <span className="value">₹ 18,420</span>
              </div>
              <div>
                <span className="label">Budget Left</span>
                <span className="value">₹ 6,580</span>
              </div>
              <div>
                <span className="label">Savings Rate</span>
                <span className="value">32%</span>
              </div>
            </div>
            <div className="landing-bars">
              <div className="bar-row">
                <span>Rent</span>
                <div className="bar-track">
                  <div className="bar-fill bar-fill-1" />
                </div>
              </div>
              <div className="bar-row">
                <span>Food</span>
                <div className="bar-track">
                  <div className="bar-fill bar-fill-2" />
                </div>
              </div>
              <div className="bar-row">
                <span>Travel</span>
                <div className="bar-track">
                  <div className="bar-fill bar-fill-3" />
                </div>
              </div>
            </div>
            <div className="pill pill-ai">
              AI suggests: “Lower food spends by 8% to hit your savings goal.”
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
