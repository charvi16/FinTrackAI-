import { Link } from "react-router-dom";
import "./ProfileDropdown.css";

export default function ProfileDropdown({ user, onLogout }) {
  return (
    <div className="profile-dropdown">
      {/* <div className="profile-dropdown-header">
        <img
          src={user?.image || "/default-user.png"}
          alt="profile"
          className="profile-dropdown-img"
        />
        <div>
          <h4>{user?.name || "User"}</h4>
          <p>{user?.email}</p>
        </div>
      </div> */}

      <div className="profile-dropdown-menu">
        <Link to="/profile">Profile</Link>
        <Link to="/goals">Goal</Link>
        <Link to="/calculator">Emergency Fund Calculator</Link>
        <button onClick={onLogout}>Logout</button>
      </div>
    </div>
  );
}
