import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  const location = useLocation();

  if (!token) {
    if (location.pathname !== "/" && location.pathname !== "/register") {
      return <Navigate to="/" replace />;
    }
    return children || null;
  }

  return children;
};

export default ProtectedRoute;
