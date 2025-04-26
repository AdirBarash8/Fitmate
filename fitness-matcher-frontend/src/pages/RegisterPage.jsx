import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import "../styles/register.css";

const RegisterPage = () => {
  const { setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    age: "",
    gender: "",
  });

  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateInputs = () => {
    if (!form.email || !form.password) {
      return "Email and password are required.";
    }
    if (form.password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    return null;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      // Register
      await axios.post("/auth/register", {
        email: form.email,
        password: form.password,
      });

      // Login immediately
      const loginRes = await axios.post("/auth/login", {
        email: form.email,
        password: form.password,
      });

      setToken(loginRes.data.token);
      localStorage.setItem("token", loginRes.data.token);

      // Fetch profile to check if preferences are set
      const profileRes = await axios.get("/users/me");
      const profile = profileRes.data;

      const hasPreferences = Array.isArray(profile.Workout_Type) && profile.Workout_Type.length > 0;

      if (hasPreferences) {
        navigate("/match");
      } else {
        navigate("/profile");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Create Account</h2>
        <form onSubmit={handleRegister}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <input
            name="age"
            type="number"
            placeholder="Age (optional)"
            value={form.age}
            onChange={handleChange}
          />
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select Gender (optional)</option>
            <option value="Female">Female</option>
            <option value="Male">Male</option>
            <option value="Other">Other</option>
          </select>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" disabled={isLoading}>
            {isLoading ? "Registering..." : "Register"}
          </button>
        </form>
        <p>
          Already have an account?{" "}
          <a href="/login" style={{ color: "blue" }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
