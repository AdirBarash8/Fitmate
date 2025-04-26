import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      try {
        const decoded = jwtDecode(token);
        setUser({
          user_id: decoded.user_id,
          email: decoded.email,
          isAdmin: decoded.isAdmin,
        });
      } catch (err) {
        console.error("Failed to decode JWT", err);
        setUser(null);
        localStorage.removeItem("token");
        if (token !== null) {
          setToken(null);
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
    <AuthContext.Provider value={{ token, setToken, user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
