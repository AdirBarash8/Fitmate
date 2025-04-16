import { useEffect, useState, useContext } from "react";
import axios from "../utils/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import Select from "react-select";
import ClipLoader from "react-spinners/ClipLoader";
//asda
const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Static options
  const daysOptions = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => ({ label: day, value: day }));
  const goalOptions = ["Weight Loss", "Muscle Gain", "Stress Reduction", "Endurance", "General Health"].map(goal => ({ label: goal, value: goal }));
  const workoutOptions = ["Gym", "Running", "Yoga", "Pilates", "HIIT", "Swimming"].map(w => ({ label: w, value: w }));

  useEffect(() => {
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
  }, [user.user_id]);

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

  if (loading) return <div className="center"><ClipLoader /></div>;

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

        <label>Available Days:</label>
        <Select
          isMulti
          options={daysOptions}
          value={formData.Available_Days?.map(d => ({ label: d, value: d }))}
          onChange={(selected) => handleSelectChange("Available_Days", selected)}
        />

        <label>Fitness Goals:</label>
        <Select
          isMulti
          options={goalOptions}
          value={formData.Fitness_Goal?.map(g => ({ label: g, value: g }))}
          onChange={(selected) => handleSelectChange("Fitness_Goal", selected)}
        />

        <label>Workout Type:</label>
        <Select
          isMulti
          options={workoutOptions}
          value={formData.Workout_Type?.map(w => ({ label: w, value: w }))}
          onChange={(selected) => handleSelectChange("Workout_Type", selected)}
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
