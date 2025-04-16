import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  // 🔁 Decode user from token whenever token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      try {
        const decoded = jwtDecode(token);
        setUser({
          user_id: decoded.user_id,
          email: decoded.email,
          isAdmin: decoded.isAdmin
        });
      } catch (err) {
        console.error("Failed to decode JWT", err);
  
        // ✅ Only reset if token is actually invalid
        setUser(null);
        localStorage.removeItem("token");
  
        // ❗️Don't loop yourself — check if token is already null
        if (token !== null) {
          setToken(null); // triggers re-render only if needed
        }
      }
    } else {
      setUser(null);
      localStorage.removeItem("token");
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
