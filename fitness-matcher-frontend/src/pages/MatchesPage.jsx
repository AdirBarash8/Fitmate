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
    const fetchMatches = async () => {
      try {
        const res = await axios.get(`/matches?user_id=${user.user_id}`);
        setMatches(res.data.matches || []);
      } catch (err) {
        console.error("Failed to fetch matches:", err);
      }
    };

    fetchMatches();
  }, [user.user_id]);

  const handleSchedule = (partnerId) => {
    navigate(`/meetings/new/${partnerId}`);
  };

  return (
    <div className="matches-page-container">
      <h2>🤝 Your Matches</h2>

      {matches.length === 0 ? (
        <p className="no-matches-msg">No matches found yet. Go to the Match page to find workout partners!</p>
      ) : (
        <ul className="matches-list">
          {matches.map((match) => {
            const partnerId =
              match.user_id_1 === user.user_id
                ? match.user_id_2
                : match.user_id_1;
            return (
              <li key={match._id} className="match-card">
                <span>👤 Matched with user #{partnerId}</span>
                <button onClick={() => handleSchedule(partnerId)} className="schedule-btn">
                  📅 Schedule Meeting
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default MatchesPage;
