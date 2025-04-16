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
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const fieldsToValidate = ["Age", "Gender", "Motivation_Level", "Time_Flexibility", "Available_Days", "Fitness_Goal", "Workout_Type"];

  useEffect(() => {
    if (!user) return;

    axios.get(`/users/${user.user_id}`)
      .then(res => {
        const data = {
          ...res.data,
          Available_Days: res.data.Available_Days || [],
          Fitness_Goal: res.data.Fitness_Goal || [],
          Workout_Type: res.data.Workout_Type || [],
        };
        setFormData(data);
        setOriginalData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load profile", err);
        setLoading(false);
      });
  }, [user]);

  useEffect(() => {
    if (user === null && !loading) navigate("/login");
  }, [user, loading, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Age || formData.Age < 13 || formData.Age > 99) {
      newErrors.Age = "Age must be between 13 and 99";
    }
    fieldsToValidate.forEach(field => {
      if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
        newErrors[field] = `${field.replace("_", " ")} is required`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isChanged = () => {
    return JSON.stringify(formData) !== JSON.stringify(originalData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!isChanged()) return alert("No changes to save.");

    setSaving(true);
    try {
      await axios.put(`/users/${user.user_id}`, formData);
      setSuccess(true);
      setOriginalData(formData);
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
        <label title="Enter your age (between 13 and 99)">Age:</label>
        <input
          type="number"
          name="Age"
          value={formData.Age || ""}
          onChange={handleChange}
          min={13}
          max={99}
        />
        {errors.Age && <span className="error">{errors.Age}</span>}

        <label title="Select your gender">Gender:</label>
        <select name="Gender" value={formData.Gender || ""} onChange={handleChange}>
          <option value="">--Select--</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
        {errors.Gender && <span className="error">{errors.Gender}</span>}

        <label title="How motivated are you to train?">Motivation Level:</label>
        <select name="Motivation_Level" value={formData.Motivation_Level || ""} onChange={handleChange}>
          <option value="">--Select--</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {errors.Motivation_Level && <span className="error">{errors.Motivation_Level}</span>}

        <label title="Are your training times fixed or flexible?">Time Flexibility:</label>
        <select name="Time_Flexibility" value={formData.Time_Flexibility || ""} onChange={handleChange}>
          <option value="">--Select--</option>
          <option value="Flexible">Flexible</option>
          <option value="Fixed">Fixed</option>
        </select>
        {errors.Time_Flexibility && <span className="error">{errors.Time_Flexibility}</span>}

        <CheckboxDropdown
          label="Available Days"
          options={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
          selectedValues={formData.Available_Days}
          onChange={(val) => setFormData(prev => ({ ...prev, Available_Days: val }))}
        />
        {errors.Available_Days && <span className="error">{errors.Available_Days}</span>}

        <CheckboxDropdown
          label="Fitness Goals"
          options={["Weight Loss", "Muscle Gain", "Stress Reduction", "Endurance", "General Health"]}
          selectedValues={formData.Fitness_Goal}
          onChange={(val) => setFormData(prev => ({ ...prev, Fitness_Goal: val }))}
        />
        {errors.Fitness_Goal && <span className="error">{errors.Fitness_Goal}</span>}

        <CheckboxDropdown
          label="Workout Types"
          options={["Gym", "Running", "Yoga", "Pilates", "HIIT", "Swimming"]}
          selectedValues={formData.Workout_Type}
          onChange={(val) => setFormData(prev => ({ ...prev, Workout_Type: val }))}
        />
        {errors.Workout_Type && <span className="error">{errors.Workout_Type}</span>}

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {success && <div className="success-checkmark">&#10004;</div>}
    </div>
  );
};

export default ProfilePage;
