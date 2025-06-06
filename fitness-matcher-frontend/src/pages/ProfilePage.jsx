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
  const [locationLoading, setLocationLoading] = useState(false);
  const [formData, setFormData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const fieldsToValidate = [
    "name", "Age", "Gender", "Motivation_Level", "Time_Flexibility",
    "Available_Days", "Fitness_Goal", "Workout_Type"
  ];

  useEffect(() => {
    if (!user) return;

    axios.get(`/users/${user.user_id}`)
      .then(res => {
        const data = {
          ...res.data,
          Available_Days: res.data.Available_Days || [],
          Fitness_Goal: res.data.Fitness_Goal || [],
          Workout_Type: res.data.Workout_Type || [],
          Workout_Style: res.data.Workout_Style || [],
          Coaching_Preference: res.data.Coaching_Preference || [],
          Preferred_Workout_Time: res.data.Preferred_Workout_Time || [],
          Preferred_Partner_Gender: res.data.Preferred_Partner_Gender || [],
          Preferred_Partner_Age_Range: res.data.Preferred_Partner_Age_Range || [],
          Preferred_Partner_Experience_Level: res.data.Preferred_Partner_Experience_Level || [],
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

  const handleUseMyLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
  
    setLocationLoading(true);
  
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
  
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
          const data = await res.json();
          const locationLabel = data.display_name || "Unknown location";
  
          setFormData(prev => ({
            ...prev,
            home_location: { lat: latitude, lon: longitude },
            home_location_label: locationLabel
          }));
        } catch (err) {
          console.error("Failed to fetch location label:", err);
          alert("Could not resolve location.");
        }
  
        setLocationLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Failed to get your location.");
        setLocationLoading(false);
      }
    );
  };
  
  const handleManualLocationInput = async () => {
    if (!formData.home_location_label || formData.home_location_label.trim().length < 3) {
      alert("Please enter a valid location name.");
      return;
    }
  
    setLocationLoading(true);
  
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(formData.home_location_label)}&format=json&limit=1`);
      const data = await res.json();
  
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
  
        setFormData(prev => ({
          ...prev,
          home_location: { lat: parseFloat(lat), lon: parseFloat(lon) },
          home_location_label: display_name
        }));
      } else {
        alert("Could not find the location.");
      }
    } catch (err) {
      console.error("Failed to fetch coordinates from label:", err);
      alert("Failed to fetch location.");
    }
  
    setLocationLoading(false);
  };

  
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long";
    }

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
        <label>Name:</label>
        <input type="text" name="name" value={formData.name || ""} onChange={handleChange} />
        {errors.name && <span className="error">{errors.name}</span>}

        <label>Age:</label>
        <input type="number" name="Age" value={formData.Age || ""} onChange={handleChange} min={13} max={99} />
        {errors.Age && <span className="error">{errors.Age}</span>}

        <label>Gender:</label>
        <select name="Gender" value={formData.Gender || ""} onChange={handleChange}>
          <option value="">--Select--</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        {errors.Gender && <span className="error">{errors.Gender}</span>}

        <label>Travel Willingness (km):</label>
        <input type="number" name="Travel_Willingness_km" value={formData.Travel_Willingness_km || ""} onChange={handleChange} />

        <label>Motivation Level:</label>
        <select name="Motivation_Level" value={formData.Motivation_Level || ""} onChange={handleChange}>
          <option value="">--Select--</option>
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <label>Time Flexibility:</label>
        <select name="Time_Flexibility" value={formData.Time_Flexibility || ""} onChange={handleChange}>
          <option value="">--Select--</option>
          <option>Flexible</option>
          <option>Fixed</option>
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
          options={["Gym", "Running", "Yoga", "Pilates", "HIIT", "Swimming", "Crossfit"]}
          selectedValues={formData.Workout_Type}
          onChange={(val) => setFormData(prev => ({ ...prev, Workout_Type: val }))}
        />

        <CheckboxDropdown
          label="Workout Style"
          options={["Solo", "Easygoing", "Social", "Competitive"]}
          selectedValues={formData.Workout_Style}
          onChange={(val) => setFormData(prev => ({ ...prev, Workout_Style: val }))}
        />

        <CheckboxDropdown
          label="Coaching Preference"
          options={["Doesn't matter", "Self-trained", "With trainer"]}
          selectedValues={formData.Coaching_Preference}
          onChange={(val) => setFormData(prev => ({ ...prev, Coaching_Preference: val }))}
        />

        <CheckboxDropdown
          label="Preferred Workout Time"
          options={["Morning", "Afternoon", "Evening"]}
          selectedValues={formData.Preferred_Workout_Time}
          onChange={(val) => setFormData(prev => ({ ...prev, Preferred_Workout_Time: val }))}
        />

        <CheckboxDropdown
          label="Preferred Partner Gender"
          options={["No Preference", "Male", "Female"]}
          selectedValues={formData.Preferred_Partner_Gender}
          onChange={(val) => setFormData(prev => ({ ...prev, Preferred_Partner_Gender: val }))}
        />

        <CheckboxDropdown
          label="Preferred Partner Age Range"
          options={["Any", "18-25", "26-35", "36-45", "46+"]}
          selectedValues={formData.Preferred_Partner_Age_Range}
          onChange={(val) => setFormData(prev => ({ ...prev, Preferred_Partner_Age_Range: val }))}
        />

        <CheckboxDropdown
          label="Preferred Partner Experience Level"
          options={["Beginner", "Intermediate", "Advanced", "Any"]}
          selectedValues={formData.Preferred_Partner_Experience_Level}
          onChange={(val) => setFormData(prev => ({ ...prev, Preferred_Partner_Experience_Level: val }))}
        />

        <label title="Where is your home base for workouts?">Home Location:</label>
        <input
          type="text"
          name="home_location_label"
          value={formData.home_location_label || ""}
          onChange={handleChange}
          placeholder="Enter your home location (e.g., Tel Aviv)"
        />

        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          <button type="button" onClick={handleUseMyLocation} disabled={locationLoading}>
            {locationLoading ? "Fetching..." : "📍 Use My Current Location"}
          </button>
          <button type="button" onClick={handleManualLocationInput} disabled={locationLoading}>
            {locationLoading ? "Fetching..." : "🧭 Update from Address"}
          </button>
        </div>

        {formData.home_location && (
          <div className="location-preview">
            <small>📌 Lat: {formData.home_location.lat.toFixed(4)} | Lon: {formData.home_location.lon.toFixed(4)}</small>
          </div>
        )}


        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      {success && <div className="success-checkmark">&#10004;</div>}
    </div>
  );
};

export default ProfilePage;
