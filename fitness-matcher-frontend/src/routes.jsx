import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MatchPage from "./pages/MatchPage";
import MeetingsDashboard from "./pages/MeetingsDashboard";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/match" element={<MatchPage />} />
        <Route path="/meetings" element={<MeetingsDashboard />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
