import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import "../styles/meetingScheduler.css";

const MeetingSchedulerPage = () => {
  const { state } = useLocation();
  const partnerId = state?.partnerId;
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [partner, setPartner] = useState(null);
  const [commonDays, setCommonDays] = useState([]);
  const [formData, setFormData] = useState({
    day: "",
    timeSlot: "",
    location: ""
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchPartnerData() {
      try {
        const res = await axios.get(`/users/${partnerId}`);
        setPartner(res.data);

        // Calculate overlapping available days
        const myDays = user?.Available_Days || [];
        const partnerDays = res.data.Available_Days || [];
        const overlap = myDays.filter(day => partnerDays.includes(day));
        setCommonDays(overlap);
      } catch (err) {
        console.error("Failed to fetch partner data:", err);
      }
    }
    fetchPartnerData();
  }, [partnerId, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/meetings", {
        user_id_1: user.user_id,
        user_id_2: Number(partnerId),
        day: formData.day,
        time_slot: formData.timeSlot,
        location: formData.location,
        status: "Pending" // pending approval
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/meetings"); // go to meetings page (or wherever you want)
      }, 2000);
    } catch (err) {
      console.error("Failed to schedule meeting:", err);
    }
  };

  if (!partner) {
    return <div className="center">Loading...</div>;
  }

  return (
    <div className="meeting-scheduler-container">
      <h2>📅 Schedule a Meeting with {partner?.Gender} #{partnerId}</h2>

      {commonDays.length === 0 ? (
        <p style={{ color: "red" }}>❗ No common available days found. Please contact your partner.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Select Common Available Day:</label>
          <select name="day" value={formData.day} onChange={handleChange} required>
            <option value="">-- Select Day --</option>
            {commonDays.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>

          <label>Select Time:</label>
          <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} required>
            <option value="">-- Select Time --</option>
            <option value="Morning">Morning (8:00-11:00)</option>
            <option value="Afternoon">Afternoon (12:00-16:00)</option>
            <option value="Evening">Evening (17:00-20:00)</option>
          </select>

          <label>Meeting Location:</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter meeting location"
            required
          />

          <button type="submit">Schedule Meeting</button>
        </form>
      )}

      {success && <p className="success-msg">✅ Meeting Scheduled! Waiting for partner confirmation.</p>}
    </div>
  );
};

export default MeetingSchedulerPage;
