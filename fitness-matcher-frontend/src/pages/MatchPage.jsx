import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import TinderCard from "react-tinder-card";
import { animated, useSpring } from "@react-spring/web";
import { AuthContext } from "../context/AuthContext";
import "../styles/MatchPage.css";

function MatchPage() {
  const { user } = useContext(AuthContext);
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const [loading, setLoading] = useState(true);
  const childRefs = useRef([]);
  const navigate = useNavigate();

  const [{ scale, rotate, opacity }, api] = useSpring(() => ({
    scale: 1,
    rotate: 0,
    opacity: 1,
    config: { tension: 500, friction: 30 },
  }));

  useEffect(() => {
  if (!user) return;

  async function fetchMatches() {
    try {
      const res = await axios.get(`/match?user_id=${user.user_id}`);
      const allMatches = res.data.matches || [];
      setMatches(allMatches.slice(0, 5));
      childRefs.current = Array(allMatches.length)
        .fill(0)
        .map(() => React.createRef());
    } catch (err) {
      console.error("❌ Failed to fetch matches", err);
    } finally {
      setLoading(false);
    }
  }

  fetchMatches();
}, [user]);


  useEffect(() => {
    if (matches.length > 0 && currentIndex >= matches.length) {
      const timeout = setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, matches.length, navigate]);

  const handleSwipe = async (direction) => {
  const currentMatch = matches[currentIndex];
  const liked = direction === "right";

  console.log(`You swiped ${direction} on user ${currentMatch.user_id}`);

  try {
    await axios.patch("/matches/like", {
      user_id_2: currentMatch.user_id,
      liked, // send true or false
    });
    console.log(`📝 Match marked as ${liked ? "liked ✅" : "not liked ❌"}`);
  } catch (err) {
    console.warn("❌ Failed to update match like status:", err.message);
  }

  setSwipeDirection(direction);
  setTimeout(() => {
    setCurrentIndex((prev) => prev + 1);
    setSwipeDirection(null);
  }, 300);
};


  const onCardRelease = () => {
    api.start({ scale: 1, rotate: 0, opacity: 1 });
  };

  const scheduleMeeting = (partnerId) => {
    navigate(`/meetings/new/${partnerId}`);
  };

  return (
    <div className="match-page p-6">
      {loading || !user ? (
        <div className="loading-text">⏳ Loading matches...</div>
      ) : matches.length === 0 ? (
        <div className="no-matches-text">😕 No matches found</div>
      ) : currentIndex >= matches.length ? (
        <div className="no-matches-text">🎉 No more matches to display</div>
      ) : (
        <>
          <div className="card-container">
            <TinderCard
              key={matches[currentIndex].user_id}
              onSwipe={(dir) => handleSwipe(dir)}
              onCardLeftScreen={onCardRelease}
              preventSwipe={["up", "down"]}
              swipeRequirementType="position"
              swipeThreshold={50}
              ref={childRefs.current[currentIndex]}
            >
              <animated.div
                style={{ scale, rotate, opacity }}
                className="match-card"
              >
                {swipeDirection === "right" && (
                  <div className="swipe-indicator like">Liked 💚</div>
                )}
                {swipeDirection === "left" && (
                  <div className="swipe-indicator nope">Skipped ❌</div>
                )}

                <h2>
                  {matches[currentIndex].name
                    ? `💬 ${matches[currentIndex].name}`
                    : `User #${matches[currentIndex].user_id}`}
                </h2>
                <p>🎯 Match Score: {matches[currentIndex].score?.toFixed(2)}</p>
                <p>🎂 Age: {matches[currentIndex].Age || "Not provided"}</p>
                <p>⚥ Gender: {matches[currentIndex].Gender || "Not provided"}</p>
                <p>
                  🏋️ Workout Types:{" "}
                  {matches[currentIndex].Workout_Type?.join(", ") || "Not provided"}
                </p>
                <p>
                  🎯 Goals:{" "}
                  {matches[currentIndex].Fitness_Goal?.join(", ") || "Not provided"}
                </p>
                <p>
                  📍 Location:{" "}
                  {matches[currentIndex].home_location_label || "Unknown"}
                </p>
              </animated.div>
            </TinderCard>
          </div>

          <div className="buttons-container">
            <button
              onClick={() => handleSwipe("left")}
              className="action-button nope-button"
            >
              ❌
            </button>
            <button
              onClick={() => handleSwipe("right")}
              className="action-button like-button"
            >
              💚
            </button>
          </div>

          <div className="schedule-later-container">
            <button
              onClick={() =>
                scheduleMeeting(matches[currentIndex].user_id)
              }
              className="schedule-button"
            >
              📅 Schedule a Meeting with User {matches[currentIndex].user_id}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MatchPage;
