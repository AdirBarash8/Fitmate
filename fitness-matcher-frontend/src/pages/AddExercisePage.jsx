import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import "../styles/addExercisePage.css";

const AddExercisePage = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    exercise: "",  // 👈 changed from name → exercise
    duration: "",
    calories: "",
    description: "",
  });

  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await axios.post("/exercises", {
        user_id: user.user_id,
        exercise: formData.exercise,
        duration: Number(formData.duration),
        calories: Number(formData.calories),
      });
      setSuccessMsg("Exercise added successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      setError("Failed to add exercise.");
      console.error(err);
    }
  };

  return (
    <div className="add-exercise-page">
      <h2>➕ Add Exercise</h2>
      <form onSubmit={handleSubmit} className="exercise-form">
        <input
          type="text"
          name="exercise"
          placeholder="Exercise name"
          value={formData.exercise}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="duration"
          placeholder="Duration (minutes)"
          value={formData.duration}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="calories"
          placeholder="Calories burned"
          value={formData.calories}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Optional description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
        />
        <button type="submit">Add</button>
        {successMsg && <p className="success">{successMsg}</p>}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default AddExercisePage;
