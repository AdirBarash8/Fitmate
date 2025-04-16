import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  // ✅ Only redirect to /login if you're NOT already there
  if (!token) {
    if (location.pathname !== "/login" && location.pathname !== "/register") {
      return <Navigate to="/login" replace />;
    }

    // ✅ Already on /login or /register — do NOT redirect again
    return children || null;
  }

  return children;
};

export default ProtectedRoute;
