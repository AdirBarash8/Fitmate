import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.css";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
<nav className="navbar">
  <div className="navbar-left">
    <a href="/Dashboard" className="navbar-brand">
      <span className="navbar-icon">🏋️</span> FitMate
    </a>
  </div>

  <div className="navbar-links">
    <a href="/match">Match</a>
    <a href="/profile">Profile</a>
    <a href="/meetings">Meetings</a>
    <a href="/exercises/add">Add Exercise</a>
    <button onClick={logout}>Logout</button>
  </div>
</nav>

  );
};

export default Navbar;
