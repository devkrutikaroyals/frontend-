import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Signup from "./Components/Signup";
import ManufacturerDashboard from "./pages/ManufacturerDashboard";
import MasterDashboard from "./pages/MasterDashboard";

// Function to check authentication and role-based access
const ProtectedRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role"); // ✅ Ensure this correctly stores "master"

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/master-dashboard"
          element={
            <ProtectedRoute role="master"> {/* ✅ Changed from "admin" to "master" */}
              <MasterDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manufacturer-dashboard"
          element={
            <ProtectedRoute role="manufacturer">
              <ManufacturerDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
