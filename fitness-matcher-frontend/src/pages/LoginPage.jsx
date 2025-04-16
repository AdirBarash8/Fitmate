import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { FiLoader } from "react-icons/fi";
import "../styles/login.css";

const LoginPage = () => {
  const { setToken, setUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("LoginPage mounted");
  }, []);

  const validateInputs = () => {
    if (!email || !password) {
      return "Email and password are required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters.";
    }
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // ✅ Prevent native reload
    console.log("✋ prevented default");
    setError(null);

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("/auth/login", {
        email,
        password,
      });

      setToken(res.data.token);
      setUser({ user_id: res.data.user_id });

      navigate("/match");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
      console.trace(); // 🔍 Shows who triggered rerender if it still happens
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Welcome Back</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <FiLoader className="spin" />
                Logging in...
              </>
            ) : (
              "Log In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
