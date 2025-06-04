import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { FiLoader } from "react-icons/fi";
import "../styles/login.css";

const LoginPage = () => {
  const { setToken } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("🟢 LoginPage mounted");
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
    e.preventDefault();
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
  
      setToken(res.data.token); // Triggers context decoding
      navigate("/dashboard");
    } catch (err) {
      const message = err.response?.data?.error || "Login failed. Please try again.";
  
      setError(message);
  
      // Optional: log for dev
      console.log("Login error:", err.response?.status, message);
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
          {error && (
            <div className="error-message">
              {error}
              {error.toLowerCase().includes("user") && (
                <p>
                  Don't have an account?{" "}
                  <a href="/register" style={{ color: "blue" }}>
                    Register here
                  </a>
                </p>
              )}
            </div>
          )}
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
