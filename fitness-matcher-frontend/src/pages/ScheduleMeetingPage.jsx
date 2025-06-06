import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/meetingScheduler.css";

const MeetingSchedulerPage = () => {
  const { partnerId: paramPartnerId } = useParams();
  const { state } = useLocation();
  const partnerId = paramPartnerId || state?.partnerId;

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [partner, setPartner] = useState(null);
  const [commonDays, setCommonDays] = useState([]);
  const [existingMeetings, setExistingMeetings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [location, setLocation] = useState("");
  const [success, setSuccess] = useState(false);

  const dayToNum = {
    Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6,
  };

  useEffect(() => {
    async function fetchData() {
      if (!partnerId) {
        console.warn("Missing partner ID. Redirecting to match page.");
        navigate("/match");
        return;
      }

      try {
        const [partnerRes, userMeetingsRes] = await Promise.all([
          axios.get(`/users/${partnerId}`),
          axios.get(`/meetings?user_id=${user.user_id}`),
        ]);

        const partnerData = partnerRes.data;
        setPartner(partnerData);

        const myDays = user?.Available_Days || [];
        const theirDays = partnerData?.Available_Days || [];
        const overlap = myDays.filter((day) => theirDays.includes(day));
        setCommonDays(overlap);

        setExistingMeetings(userMeetingsRes.data?.meetings || []);
      } catch (err) {
        console.error("❌ Failed to fetch meeting/partner info:", err);
      }
    }

    fetchData();
  }, [partnerId, user, navigate]);

  const isDateAllowed = (date) => {
    const now = new Date();
    if (date < now) return false; // disallow past dates

    const dayNum = date.getDay(); // 0 (Sun) - 6 (Sat)
    const allowedDays = commonDays.map((d) => dayToNum[d]);
    if (!allowedDays.includes(dayNum)) return false;

    const selectedStart = new Date(date);
    const selectedEnd = new Date(date.getTime() + 30 * 60000); // 30min slot

    for (const meeting of existingMeetings) {
      const start = new Date(meeting.datetime);
      const end = new Date(start.getTime() + 30 * 60000);

      const overlap =
        selectedStart < end && selectedEnd > start;

      if (overlap) return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate || !location) {
      alert("Please select a valid date and location.");
      return;
    }

    try {
      const payload = {
        user_1: user.user_id,
        user_2: Number(partnerId),
        datetime: selectedDate.toISOString(),
        location,
        status: "Pending"
      };

      await axios.post("/meetings", payload);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/meetings");
      }, 2000);
    } catch (err) {
      console.error("❌ Failed to schedule meeting:", err);
    }
  };

  if (!partner) {
    return <div className="center">Loading partner information...</div>;
  }

  return (
    <div className="meeting-scheduler-container">
      <h2>📅 Schedule a Meeting with {partner?.Gender} #{partnerId}</h2>

      {commonDays.length === 0 ? (
        <p style={{ color: "red" }}>
          ❗ No common available days found. Please contact your partner.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <label>Select Date & Time:</label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            filterDate={isDateAllowed}
            showTimeSelect
            timeIntervals={30}
            dateFormat="MMMM d, yyyy h:mm aa"
            placeholderText="Pick a date & time"
            required
          />

          <label>Meeting Location:</label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter meeting location"
            required
          />

          <button type="submit">Schedule Meeting</button>
        </form>
      )}

      {success && (
        <p className="success-msg">
          ✅ Meeting Scheduled! Waiting for partner confirmation.
        </p>
      )}
    </div>
  );
};

export default MeetingSchedulerPage;
