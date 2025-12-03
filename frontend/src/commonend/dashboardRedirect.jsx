import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './auth.jsx';

const DashboardRedirect = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    console.log('DashboardRedirect - Checking authentication...');
    console.log('Is authenticated:', isAuthenticated);
    console.log('User data:', user);
    console.log('Loading:', loading);

    // Only redirect if authenticated and user data is available
    if (!loading && isAuthenticated && user) {
      console.log('DashboardRedirect - User role:', user.role);
      
      // Convert role to lowercase for case-insensitive comparison
      const userRole = user.role?.toLowerCase();
      
      switch(userRole) {
        case 'administrator':
        case 'admin':
          console.log('Redirecting to admin dashboard');
          navigate('/admin/dashboard', { replace: true });
          break;
        case 'owner':
          console.log('Redirecting to owner dashboard');
          navigate('/owner/dashboard', { replace: true });
          break;
        case 'user':
          console.log('Redirecting to user dashboard');
          navigate('/user/dashboard', { replace: true });
          break;
        default:
          console.warn('Unknown role:', user.role, 'redirecting to home');
          navigate('/', { replace: true });
      }
    } else if (!loading && !isAuthenticated) {
      // If not authenticated, redirect to login
      console.log('Not authenticated, redirecting to login');
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, user, loading, navigate]);

  // Show loading spinner
  return (
    <div className="dashboard-redirect-container">
      <div className="loading-spinner">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Redirecting to your dashboard...</span>
        </div>
        <p className="mt-3">Redirecting to your dashboard...</p>
      </div>

      <style jsx>{`
        .dashboard-redirect-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #e0e0f0;
          font-family: 'Poppins', sans-serif;
        }
        
        .loading-spinner {
          text-align: center;
        }
        
        .spinner-border {
          width: 3rem;
          height: 3rem;
          border-color: #9b59b6 !important;
          border-right-color: transparent !important;
        }
        
        p {
          color: #d1b3ff;
          font-size: 1.2rem;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default DashboardRedirect;