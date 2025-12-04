import React from "react";
import { Link, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../commonend/auth.jsx";

import DashboardHome from "./dashboardHome.jsx";
import Orders from "./ownerOrders.jsx";


const UserDashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      {/* Sidebar / Navbar */}
      <nav className="dashboard-nav">
        <h2>Welcome, {user?.username}</h2>
        <ul>
          <li><Link to="">Dashboard Home</Link></li>
          <li><Link to="orders">My Orders</Link></li>
          
        </ul>
        <button onClick={logout}>Logout</button>
      </nav>

      {/* Nested Routes Render Here */}
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<DashboardHome />} />
          <Route path="orders" element={<Orders />} />
          

          {/* Redirect unknown paths */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboard;
