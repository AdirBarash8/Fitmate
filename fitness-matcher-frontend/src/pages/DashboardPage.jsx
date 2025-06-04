import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/dashboardPage.css";

const DashboardPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">🏋️‍♀️ Fitness Matching</h1>
      <p className="dashboard-subtitle">
        Personalized workout partner suggestions based on your availability and preferences.
      </p>

      <div className="info-cards">
        <div className="info-card">
          <p className="card-title">❤️ Matches This Week</p>
          <p className="card-value">9</p>
        </div>
        <div className="info-card">
          <p className="card-title">⏱ Avg Workout Time</p>
          <p className="card-value">3h 32m</p>
        </div>
        <div className="info-card">
          <p className="card-title">🔥 Calories Burned</p>
          <p className="card-value">2,430</p>
        </div>
      </div>

      <div className="dashboard-buttons">
        <button className="dashboard-button" onClick={() => handleNavigate("/match")}>
          🔍 Match
        </button>
        <button className="dashboard-button" onClick={() => handleNavigate("/profile")}>
          👤 Profile
        </button>
        <button className="dashboard-button" onClick={() => handleNavigate("/meetings")}>
          📅 Meetings
        </button>
        <button className="dashboard-button" onClick={() => handleNavigate("/meetings/new")}>
          ➕ Schedule
        </button>
        <button className="dashboard-button" onClick={() => handleNavigate("/update-location")}>
          📍 Location
        </button>
        <button className="dashboard-button logout" onClick={logout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
