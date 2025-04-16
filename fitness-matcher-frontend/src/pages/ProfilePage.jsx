import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import ClipLoader from "react-spinners/ClipLoader";
import '../styles/profile.css';
import CheckboxDropdown from "../components/CheckboxDropdown";



const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Static options
  const daysOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({ label: day, value: day }));
  const goalOptions = ["Weight Loss", "Muscle Gain", "Stress Reduction", "Endurance", "General Health"].map(goal => ({ label: goal, value: goal }));
  const workoutOptions = ["Gym", "Running", "Yoga", "Pilates", "HIIT", "Swimming"].map(w => ({ label: w, value: w }));

  // 🔁 Only run when user is ready
  useEffect(() => {
    if (!user) return;

    axios.get(`/users/${user.user_id}`)
      .then(res => {
        const data = res.data;
        setFormData({
          ...data,
          Available_Days: data.Available_Days || [],
          Fitness_Goal: data.Fitness_Goal || [],
          Workout_Type: data.Workout_Type || [],
        });
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load profile", err);
        setLoading(false);
      });
  }, [user]);

  // ⛔ Redirect if not logged in
  useEffect(() => {
    if (user === null && !loading) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      [name]: selectedOptions.map(option => option.value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.put(`/users/${user.user_id}`, formData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error("Update failed", err);
    }
    setSaving(false);
  };

  if (loading || !formData) {
    return <div className="center"><ClipLoader size={50} /></div>;
  }

  return (
    <div className="profile-form-container">
      <h2>🛠 Edit Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <label>Age:</label>
        <input type="number" name="Age" value={formData.Age || ""} onChange={handleChange} />

        <label>Gender:</label>
        <select name="Gender" value={formData.Gender || ""} onChange={handleChange}>
          <option value="">--Select--</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>

        <label>Motivation Level:</label>
        <select name="Motivation_Level" value={formData.Motivation_Level || ""} onChange={handleChange}>
          <option value="">--Select--</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label>Time Flexibility:</label>
        <select name="Time_Flexibility" value={formData.Time_Flexibility || ""} onChange={handleChange}>
          <option value="Flexible">Flexible</option>
          <option value="Fixed">Fixed</option>
        </select>

        <CheckboxDropdown
          label="Available Days"
          options={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
          selectedValues={formData.Available_Days}
          onChange={(val) => setFormData(prev => ({ ...prev, Available_Days: val }))}
        />

        <CheckboxDropdown
          label="Fitness Goals"
          options={["Weight Loss", "Muscle Gain", "Stress Reduction", "Endurance", "General Health"]}
          selectedValues={formData.Fitness_Goal}
          onChange={(val) => setFormData(prev => ({ ...prev, Fitness_Goal: val }))}
        />

        <CheckboxDropdown
          label="Workout Types"
          options={["Gym", "Running", "Yoga", "Pilates", "HIIT", "Swimming"]}
          selectedValues={formData.Workout_Type}
          onChange={(val) => setFormData(prev => ({ ...prev, Workout_Type: val }))}
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {success && <p className="success-msg">✅ Profile Updated!</p>}
    </div>
  );
};

export default ProfilePage;
