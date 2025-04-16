import { useEffect, useState, useContext } from "react";
import axios from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";

const ProfilePage = () => {
  const { user } = useContext(AuthContext); // contains user_id, token
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (user) {
      axios.get(`/users/${user.user_id}`)
        .then(res => {
          setFormData(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to load profile", err);
          setLoading(false);
        });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/users/${user.user_id}`, formData);
      setStatus("✅ Profile updated");
    } catch (err) {
      setStatus("❌ Update failed");
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!formData) return <p>No profile data</p>;

  return (
    <div>
      <h2>🛠 Edit Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Workout Type:</label>
        <input
          type="text"
          name="Workout_Type"
          value={formData.Workout_Type}
          onChange={handleChange}
        />

        <label>Motivation Level:</label>
        <input
          type="text"
          name="Motivation_Level"
          value={formData.Motivation_Level}
          onChange={handleChange}
        />

        {/* Add more fields as needed */}

        <button type="submit">Save</button>
      </form>

      {status && <p>{status}</p>}
    </div>
  );
};

export default ProfilePage;
