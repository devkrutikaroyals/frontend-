import React from "react";
import { Routes, Route } from "react-router-dom";
import ManufacturerDashboard from "../pages/ManufacturerDashboard";
import MasterDashboard from "../pages/MasterDashboard";

const Dashboards = () => {
  return (
    <Routes>
      <Route path="/manufacturer" element={<ManufacturerDashboard />} />
      <Route path="/master" element={<MasterDashboard />} />
    </Routes>
  );
};

export default Dashboards;
