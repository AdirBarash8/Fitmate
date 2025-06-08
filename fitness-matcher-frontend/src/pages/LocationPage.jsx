import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import "../styles/locationPage.css";

const LocationPage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const handleSendLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setStatus("");
    setError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await axios.post("/update_location", {
            user_id: user.user_id,
            lat: latitude,
            lon: longitude,
          });
          setStatus(res.data.status || "✅ Live location updated!");
          // ✅ Delay navigation to show success feedback
          setTimeout(() => {
            navigate("/match");
          }, 2000); // 2-second delay
        } catch (err) {
          setError("❌ Failed to send location.");
          console.error("Send error:", err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("⚠️ Could not get your location.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="location-page">
      <h2>📍 Share Your Location</h2>
      <button onClick={handleSendLocation} disabled={loading}>
        {loading ? <ClipLoader size={20} /> : "Match with Live Location"}
      </button>
      {status && <p className="success fade-in">{status} <br /> Redirecting to matches...</p>}
      {error && <p className="error fade-in">{error}</p>}
    </div>
  );
};

export default LocationPage;
