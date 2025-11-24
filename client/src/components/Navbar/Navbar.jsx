import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import Button from "../Button/Button.jsx";
import ProfileDropdown from "../ProfileDropdown/ProfileDropdown.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function closeDropdown(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <header className="ft-nav">
      <div className="ft-nav-inner">
        <Link to="/" className="ft-nav-logo">
          <div className="ft-nav-logo-icon">₹</div>
          <span className="ft-nav-logo-text">FintrackAI</span>
        </Link>

        <nav className="ft-nav-links">
          {isAuthenticated && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/expenses">Expenses</Link>
              <Link to="/reports">Reports</Link>
            </>
          )}
        </nav>

        <div className="ft-nav-actions" ref={dropdownRef}>
          {isAuthenticated ? (
            <>
              <img
                src={user?.image || "/default-user.png"}
                alt="profile"
                className="ft-profile-img"
                onClick={() => setOpen(!open)}
              />

              {open && (
                <ProfileDropdown user={user} onLogout={handleLogout} />
              )}
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
