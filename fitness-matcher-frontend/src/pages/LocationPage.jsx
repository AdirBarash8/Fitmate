import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../api/axiosInstance";
import ClipLoader from "react-spinners/ClipLoader";
import "../styles/locationPage.css";

const LocationPage = () => {
  const { user } = useContext(AuthContext);
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
          setStatus(res.data.status || "Location updated successfully");
        } catch (err) {
          setError("Failed to send location");
          console.error("Send error:", err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError("Could not get your location.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="location-page">
      <h2>📍 Share Your Location</h2>
      <button onClick={handleSendLocation} disabled={loading}>
        {loading ? <ClipLoader size={20} /> : "Send My Location"}
      </button>
      {status && <p className="success">{status}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default LocationPage;
