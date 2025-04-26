import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MatchPage from "./pages/MatchPage";
import MeetingsDashboard from "./pages/MeetingsDashboard";
import ScheduleMeetingPage from "./pages/ScheduleMeetingPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPanel from "./pages/AdminPanel";
import ProtectedRoute from "./components/ProtectedRoute";

function AppRoutes() {
  return (
    <AuthProvider>
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route
          path="/match"
          element={
            <ProtectedRoute>
              <MatchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings"
          element={
            <ProtectedRoute>
              <MeetingsDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/meetings/new"
          element={
            <ProtectedRoute>
              <ScheduleMeetingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
              <ProfilePage />
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
    </AuthProvider>
  );
}

export default AppRoutes;
