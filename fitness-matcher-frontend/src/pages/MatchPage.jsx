import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // ✅
import axios from "../utils/axiosInstance";
import TinderCard from "react-tinder-card";
import { animated, useSpring } from "@react-spring/web";
import "../styles/MatchPage.css";

function MatchPage() {
  const [matches, setMatches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState(null);
  const childRefs = useRef([]);

  const navigate = useNavigate(); // ✅

  const [{ scale, rotate, opacity }, api] = useSpring(() => ({
    scale: 1,
    rotate: 0,
    opacity: 1,
    config: { tension: 500, friction: 30 },
  }));

  useEffect(() => {
    async function fetchMatches() {
      try {
        const res = await axios.get("/match");
        const limitedMatches = res.data.ranks.slice(0, 3);
        setMatches(limitedMatches);
        childRefs.current = Array(limitedMatches.length)
          .fill(0)
          .map(() => React.createRef());
      } catch (err) {
        console.error("Failed to fetch matches", err);
      }
    }
    fetchMatches();
  }, []);

  const handleSwipe = (direction, match) => {
    console.log(`You swiped ${direction} on user ${match.user_id}`);
    if (direction === "right") {
      navigate(`/meetings/new/${match.user_id}`);
    } else {
      setSwipeDirection(direction);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
        setSwipeDirection(null);
      }, 300);
      setIsSwiping(false);
    }
  };  

  const onCardRelease = () => {
    api.start({ scale: 1, rotate: 0, opacity: 1 });
  };

  return (
    <div className="match-page p-6">
      {matches.length === 0 ? (
        <div className="loading-text">טוען התאמות...</div>
      ) : currentIndex >= matches.length ? (
        <div className="no-matches-text">אין עוד התאמות להציג 🎉</div>
      ) : (
        <>
          <div className="card-container">
            <TinderCard
              key={matches[currentIndex].user_id}
              onSwipe={(dir) => handleSwipe(dir, matches[currentIndex])}
              onCardLeftScreen={onCardRelease}
              preventSwipe={["up", "down"]}
              swipeRequirementType="position"
              swipeThreshold={50}
              ref={childRefs.current[currentIndex]}
            >
              <animated.div style={{ scale, rotate, opacity }} className="match-card">
                {swipeDirection === "right" && (
                  <div className="swipe-indicator like">אהבתי 💚</div>
                )}
                {swipeDirection === "left" && (
                  <div className="swipe-indicator nope">דילגתי ❌</div>
                )}
                <h2>משתמש {matches[currentIndex].user_id}</h2>
                <p>ציון התאמה: {matches[currentIndex].score}</p>
              </animated.div>
            </TinderCard>
          </div>

          <div className="buttons-container">
            <button onClick={() => handleSwipe("left", matches[currentIndex])} className="action-button nope-button">
              ❌
            </button>
            <button onClick={() => handleSwipe("right", matches[currentIndex])} className="action-button like-button">
              💚
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MatchPage;
