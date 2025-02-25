import React from "react";
import { Link } from "react-router-dom";
import "../styles/styles.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Medizon</h2>
      <ul>
        <li><Link to="/manufacturer">Manufacturer Dashboard</Link></li>
        <li><Link to="/master">Master Dashboard</Link></li>
      </ul>
    </div>
  );
};

export default Sidebar;