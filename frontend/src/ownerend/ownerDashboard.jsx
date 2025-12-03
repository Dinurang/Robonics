// pages/UserDashboard.jsx
import React from 'react';
import { useAuth } from '../commonend/auth.jsx';

const OwnerDashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div className="dashboard-container">
            <h1>Welcome  {user?.username}!</h1>
            <p>Role: {user?.role}</p>
            
            <button onClick={logout} className="btn btn-primary">Logout</button>
        </div>
    );
};

export default OwnerDashboard;
