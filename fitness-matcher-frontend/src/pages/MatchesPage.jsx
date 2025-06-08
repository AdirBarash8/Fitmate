import { useEffect, useState, useContext } from "react";
import axios from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/matchesPage.css";

const MatchesPage = () => {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchMatches = async () => {
      try {
        const res = await axios.get(`/matches/${user.user_id}`);
        console.log("✅ Matches response:", res.data.matches);
        setMatches(res.data.matches || []);
      } catch (err) {
        console.error("❌ Failed to fetch liked matches", err);
      }
    };

    fetchMatches();
  }, [user]);

  const handleSchedule = (partnerId) => {
    navigate(`/meetings/new/${partnerId}`);
  };

  return (
    <div className="matches-page-container">
      <h2>🤝 Your Liked Matches</h2>

      {matches.length === 0 ? (
        <p className="no-matches-msg">No liked matches yet. Go swipe right on someone!</p>
      ) : (
        <ul className="matches-list">
          {matches.map((match) => (
            <li key={match.user_id} className="match-card">
              <h3>💬 {match.name || `User #${match.user_id}`}</h3>
              <p>🎯 Score: {match.score?.toFixed(2)}</p>
              <p>🎂 Age: {match.Age || "Not provided"}</p>
              <p>⚥ Gender: {match.Gender || "Not provided"}</p>
              <p>🏋️ Types: {match.Workout_Type?.join(", ") || "Not provided"}</p>
              <p>🎯 Goals: {match.Fitness_Goal?.join(", ") || "Not provided"}</p>
              <p>📍 Location: {match.home_location_label || "Unknown"}</p>
              <button onClick={() => handleSchedule(match.user_id)} className="schedule-btn">
                📅 Schedule Meeting
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MatchesPage;
