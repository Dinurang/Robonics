// pages/AdminDashboard.jsx
import React from 'react';
import { useAuth } from '../commonend/auth.jsx';

const AdminDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="dashboard-container">
            <h1>Admin Dashboard</h1>
            <p>Welcome, Admin {user?.username}!</p>
            <p>You have administrative privileges.</p>
            <button onClick={logout} className="btn btn-danger">Logout</button>
        </div>
    );
};

export default AdminDashboard;