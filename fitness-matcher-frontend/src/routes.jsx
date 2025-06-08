import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import MatchPage from "./pages/MatchPage";
import MatchesPage from "./pages/MatchesPage"; // ✅ NEW
import MeetingsDashboard from "./pages/MeetingsDashboard";
import ScheduleMeetingPage from "./pages/ScheduleMeetingPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPanel from "./pages/AdminPanel";
import AddExercisePage from "./pages/AddExercisePage";
import Layout from "./pages/Layout";

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
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/match"
            element={
              <ProtectedRoute>
                <MatchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <MatchesPage />
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
            path="/meetings/new/:partnerId"
            element={
              <ProtectedRoute>
                <ScheduleMeetingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
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
          <Route
            path="/exercises/new"
            element={
              <ProtectedRoute>
                <AddExercisePage />
              </ProtectedRoute>
            }
          />
          </Route>

          {/* Catch-all for undefined routes */}
          <Route path="*" element={<div>404 - Page Not Found</div>} />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default AppRoutes;
