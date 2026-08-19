import { NavLink, useNavigate } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user") || "User";

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <span className="nav-icon">⚡</span>
        <span>Code<b>Tracker</b></span>
      </div>
      <div className="nav-links">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Dashboard
        </NavLink>
        <NavLink to="/problems" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Problems
        </NavLink>
      </div>
      <div className="nav-right">
        <span className="nav-user">👤 {user}</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
