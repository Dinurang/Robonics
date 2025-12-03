import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./commonend/auth.jsx";

import Home from "./commonend/home.jsx";
// import About from "./commonend/about.jsx";
// import Book from "./commonend/book.jsx";
// import Contact from "./commonend/contact.jsx";
import Login from "./commonend/login.jsx";
import Register from "./userend/register.jsx";
// import Projects from "./commonend/projects.jsx";
// import Pricing from "./commonend/pricing.jsx";
import UserDashboard from './userend/userDashboard';
import AdminDashboard from './adminend/adminDashboard';
import OwnerDashboard from './ownerend/ownerDashboard';
import DashboardRedirect from "./commonend/dashboardRedirect.jsx";



// Loading component
const LoadingSpinner = () => (
  <div className="loading-container" style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
    color: '#e0e0f0'
  }}>
    <div className="spinner-border text-primary" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);

// Private Route Component - Protects routes that require authentication
const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    // Redirect to appropriate dashboard based on user's actual role
    console.log(`Access denied. User role: ${user?.role}, Required roles: ${allowedRoles}`);
    
    switch(user?.role?.toLowerCase()) {
      case 'administrator':
        return <Navigate to="/admin/dashboard" replace />;
      case 'owner':
        return <Navigate to="/owner/dashboard" replace />;
      case 'user':
        return <Navigate to="/user/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

// Public Route Component - Redirects authenticated users to their dashboard
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated && user) {
    console.log('PublicRoute: User is authenticated, redirecting to dashboard');
    
    // Redirect to appropriate dashboard based on role
    switch(user?.role?.toLowerCase()) {
      case 'administrator':
        return <Navigate to="/admin/dashboard" replace />;
      case 'owner':
        return <Navigate to="/owner/dashboard" replace />;
      case 'user':
        return <Navigate to="/user/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

// Main Routes Component
export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        {/* Dashboard Redirect Route - When user clicks "My Account" or navigates to /dashboard */}
        <Route path="/dashboard" element={
          <PrivateRoute>
            <DashboardRedirect />
          </PrivateRoute>
        } />
        
        <Route path="/myaccount" element={
          <PrivateRoute>
            <DashboardRedirect />
          </PrivateRoute>
        } />

        {/* Protected Dashboard Routes */}

        <Route path="/user/dashboard/*" element={
            <PrivateRoute allowedRoles={['User', 'user']}>
              <UserDashboard />
            </PrivateRoute>
          }/>

        <Route path="/admin/dashboard" element={
          <PrivateRoute allowedRoles={['Administrator', 'Admin', 'administrator', 'admin']}>
            <AdminDashboard />
          </PrivateRoute>
        } />
        
        <Route path="/owner/dashboard" element={
          <PrivateRoute allowedRoles={['Owner', 'owner']}>
            <OwnerDashboard />
          </PrivateRoute>
        } />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}