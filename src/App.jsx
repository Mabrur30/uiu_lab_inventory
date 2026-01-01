import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import BookingPage from "./pages/BookingPage.jsx";
import MyBookings from "./pages/MyBookings.jsx";
import PenaltiesPage from "./pages/PenaltiesPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bookings" element={<BookingPage />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/penalties" element={<PenaltiesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}
