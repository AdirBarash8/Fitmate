import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import "../styles/dashboardPage.css";

const DashboardPage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    matchesThisWeek: 0,
    avgWorkoutTime: "0m",
    caloriesBurned: 0,
  });

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await axios.get("/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      }
    }

    fetchDashboardData();
  }, []);

  const handleNavigate = (path) => navigate(path);

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-title">🏋️‍♀️ Fitness Matching</h1>
      <p className="dashboard-subtitle">
        Personalized workout partner suggestions based on your availability and preferences.
      </p>

      <div className="info-cards">
        <div className="info-card">
          <p className="card-title">❤️ Matches This Week</p>
          <p className="card-value">{stats.matchesThisWeek}</p>
        </div>
        <div className="info-card">
          <p className="card-title">⏱ Avg Workout Time</p>
          <p className="card-value">{stats.avgWorkoutTime}</p>
        </div>
        <div className="info-card">
          <p className="card-title">🔥 Calories Burned</p>
          <p className="card-value">{stats.caloriesBurned}</p>
        </div>
      </div>

      <div className="dashboard-buttons">
        <button className="dashboard-button" onClick={() => handleNavigate("/match")}>
          🔍 Match
        </button>
        <button className="dashboard-button" onClick={() => handleNavigate("/matches")}>
          🤝 Your Matches
        </button>
        <button className="dashboard-button" onClick={() => handleNavigate("/meetings")}>
          📅 Meetings
        </button>
        <button className="dashboard-button" onClick={() => handleNavigate("/profile")}>
          👤 Profile
        </button>
        <button className="dashboard-button" onClick={() => handleNavigate("/update-location")}>
          📍 Location
        </button>
        <button className="dashboard-button" onClick={() => handleNavigate("/exercises/new")}>
          🏃‍♀️ Add Exercise
        </button>
        <button className="dashboard-button logout" onClick={logout}>
          🚪 Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
