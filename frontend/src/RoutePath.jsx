import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./commonend/auth.jsx";

import Home from "./commonend/home.jsx";
import About from "./commonend/about.jsx";
import SiteBook from "./commonend/book.jsx";
import Contact from "./commonend/contact.jsx";
import Login from "./commonend/login.jsx";
import Register from "./userend/register.jsx";
import Projects from "./commonend/projects.jsx";
import Pricing from "./commonend/pricing.jsx";
import UserDashboard from './userend/userDashboard';
import AdminDashboard from './adminend/adminDashboard';
import DashboardRedirect from "./commonend/dashboardRedirect.jsx";



// Import UserDashboard nested components
import DashboardHome from './userend/dashboardHome.jsx';
import Profile from './userend/userProfile.jsx';
import Orders from './userend/userOrders.jsx';
import Book from './userend/userBook.jsx';

// Import AdminDashboard nested components
import AdminDashboardHome from './adminend/adminDashboardHome.jsx';
import ViewOrders from './adminend/viewOrders.jsx';
import ViewPayments from './adminend/viewPayments.jsx';
import UpdateOrders from './adminend/updateOrders.jsx';
import ManageStaff from './adminend/manageStaff.jsx';
import UpdatePricing from './adminend/updatePricing.jsx';

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
    console.log(`Access denied. User role: ${user?.role}, Required roles: ${allowedRoles}`);
    
    // Redirect to appropriate dashboard based on role
    switch(user?.role?.toLowerCase()) {
      case 'administrator':
      case 'admin':
      case 'owner':
        return <Navigate to="/admin/dashboard" replace />;
      case 'user':
        return <Navigate to="/user/dashboard" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
};

// Special route for ManageStaff - Only accessible to owner
const OwnerOnlyRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Only allow owner role
  if (user?.role?.toLowerCase() !== 'owner') {
    console.log(`ManageStaff access denied. User role: ${user?.role}, Required: owner`);
    
    // Redirect admins and owners back to admin dashboard
    return <Navigate to="/admin/dashboard" replace />;
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
      case 'admin':
      case 'owner':
        return <Navigate to="/admin/dashboard" replace />;
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
        
        <Route path="/about" element={
          <PublicRoute>
            <About />
          </PublicRoute>
        } />

        <Route path="/projects" element={
          <PublicRoute>
            <Projects />
          </PublicRoute>
        } />
        <Route path="/pricing" element={
          <PublicRoute>
            <Pricing />
          </PublicRoute>
        } />
        <Route path="/contact" element={
          <PublicRoute>
            <Contact />
          </PublicRoute>
        } />
        <Route path="/book" element={
          <PublicRoute>
            <SiteBook />
          </PublicRoute>
        } />

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

        {/* Dashboard Redirect Route */}
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
        
        {/* User Dashboard */}
        <Route path="/user/dashboard" element={
          <PrivateRoute allowedRoles={['User', 'user']}>
            <UserDashboard />
          </PrivateRoute>
        }>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<Orders />} />
          <Route path="book" element={<Book />} />
          <Route path="*" element={<Navigate to="/user/dashboard" replace />} />
        </Route>

        {/* Admin Dashboard - Accessible to both admin and owner roles */}
        <Route path="/admin/dashboard" element={
          <PrivateRoute allowedRoles={['Administrator', 'Admin', 'administrator', 'admin', 'Owner', 'owner']}>
            <AdminDashboard />
          </PrivateRoute>
        }>
          <Route index element={<AdminDashboardHome />} />
          <Route path="vieworders" element={<ViewOrders />} />
          <Route path="viewpayments" element={<ViewPayments />} />
          <Route path="updateorders" element={<UpdateOrders />} />
          <Route path="updatepricing" element={<UpdatePricing />} />
          {/* ManageStaff is ONLY accessible to owner role */}
          <Route path="managestaff" element={
            <OwnerOnlyRoute>
              <ManageStaff />
            </OwnerOnlyRoute>
          } />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
        
        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}