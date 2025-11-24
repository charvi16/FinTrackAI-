// src/components/Footer/Footer.jsx
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="ft-footer">
      <div className="ft-footer-inner">
        <span>© {new Date().getFullYear()} FintrackAI</span>
        <span className="ft-footer-tagline">Track. Predict. Grow.</span>
      </div>
    </footer>
  );
}
