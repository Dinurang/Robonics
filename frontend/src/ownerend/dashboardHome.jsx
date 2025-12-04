// pages/UserDashboard.jsx
import React from 'react';
import { useAuth } from '../commonend/auth.jsx';

const UserDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="dashboard-container">
            <h1>Welcome to Your Dashboard, {user?.username}!</h1>
            <p>Role: {user?.role}</p>
            <p>Email: {user?.email}</p>
            <p>WhatsApp: {user?.whatsappNo}</p>
            <p>Address: {user?.postalAddress}</p>
            <button onClick={logout} className="btn btn-primary">Logout</button>
        </div>
    );
};

export default UserDashboard;