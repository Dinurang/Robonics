import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from "../commonend/auth.jsx";
import logo from '../../assets/logo.png';

const UserDashboard = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  // Get current active page
  const activePage = location.pathname.split('/').pop() || 'home';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown-custom-container')) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <>
      {/* Add Fonts and external CSS */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <div className="dashboard-container">
        {/* Top Navigation */}
        <nav className="dashboard-nav">
          <div className="nav-container">
            <Link to="/" className="logo">
              <img src={logo} alt="Robonics" className="dashboard-logo" />
              <span className="dashboard-brand">Dashboard</span>
            </Link>
            
            <div className="nav-links">
              <Link 
                to="/user/dashboard" 
                className={`nav-link ${activePage === 'dashboard' || activePage === '' ? 'active' : ''}`}
              >
                <i className="fas fa-home me-2"></i>
                <span>Home</span>
              </Link>
              
              <Link 
                to="/user/dashboard/book" 
                className={`nav-link ${activePage === 'book' ? 'active' : ''}`}
              >
                <i className="fas fa-calendar-plus me-2"></i>
                <span>Book</span>
              </Link>
              
              <Link 
                to="/user/dashboard/orders" 
                className={`nav-link ${activePage === 'orders' ? 'active' : ''}`}
              >
                <i className="fas fa-clipboard-list me-2"></i>
                <span>Orders</span>
              </Link>
              
              <Link 
                to="/user/dashboard/profile" 
                className={`nav-link ${activePage === 'profile' ? 'active' : ''}`}
              >
                <i className="fas fa-user me-2"></i>
                <span>Profile</span>
              </Link>
              
              {/* Account Dropdown */}
              <div className="dropdown-custom-container" style={{ position: 'relative' }}>
                <button 
                  className="nav-link btn-myaccount"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.5rem 1.5rem',
                    margin: '0 5px',
                    borderRadius: '25px',
                    fontWeight: '600',
                    color: 'white'
                  }}
                >
                  <i className="fas fa-user-circle me-2"></i>
                  {user?.username?.split('@')[0] || 'Account'}
                  <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'} ms-2`} style={{ fontSize: '0.8rem' }}></i>
                </button>
                
                {dropdownOpen && (
                  <div className="dropdown-custom-menu">
                    {/* <div className="dropdown-custom-header">
                      <small className="text-muted">Signed in as</small>
                      <div className="fw-bold">{user?.username}</div>
                      <div className="badge bg-purple mt-2">
                        {user?.role || 'User'}
                      </div>
                    </div> */}
                    <div className="dropdown-custom-divider"></div>
                    <Link 
                      to="/user/dashboard/profile" 
                      className="dropdown-custom-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="fas fa-user me-2"></i>
                      My Profile
                    </Link>
                    <Link 
                      to="/" 
                      className="dropdown-custom-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="fas fa-globe me-2"></i>
                      Main Site
                    </Link>
                    <div className="dropdown-custom-divider"></div>
                    <button 
                      className="dropdown-custom-item text-danger"
                      onClick={logout}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Dashboard Header */}
        <header className="dashboard-header">
          <div className="header-content">
            <h1>Welcome back, <span className="highlight">{user?.username?.split('@')[0] || 'User'}</span>!</h1>
            <p>Manage and view your orders and bookings</p>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-main">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="dashboard-footer">
          <div className="footer-content">
            <p>&copy; 2025 Robonics.</p>
            <div className="footer-links">
              <span>Logged in as: <strong>{user?.username}</strong></span>
            </div>
          </div>
        </footer>
      </div>

      {/* ========== STYLES START HERE ========== */}
      <style jsx>{`
        /* Dashboard Container - Matching home.jsx theme */
        .dashboard-container {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(180deg, #0d0d14, #1a1a2e);
          color: #e0e0f0;
          min-height: 100vh;
        }

        /* Navigation - Matching home.jsx */
        .dashboard-nav {
          background-color: #1a1a2e !important;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(155, 89, 182, 0.3);
          position: sticky;
          top: 0;
          z-index: 1000;
          box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
        }

        .nav-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 1rem;
          text-decoration: none;
        }

        .dashboard-logo {
          height: 60px;
          width: auto;
          border-radius: 12px;
          padding: 4px;
          background: linear-gradient(145deg, #222238, #1a1a2e);
          box-shadow: 0 4px 12px rgba(155, 89, 182, 0.3);
          transition: all 0.3s ease;
        }

        .dashboard-logo:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(155, 89, 182, 0.5);
        }

        .dashboard-brand {
          color: #ffffff;
          font-weight: 600;
          font-size: 1.5rem;
          background: linear-gradient(45deg, #9b59b6, #8e44ad);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        /* Navigation Links - Matching home.jsx */
        .nav-link {
          color: #c0bfff !important;
          font-weight: 500;
          padding: 0.5rem 1.2rem;
          transition: all 0.3s ease;
          text-decoration: none !important;
          border-radius: 25px;
          display: flex;
          align-items: center;
        }

        .nav-link.active {
          background: linear-gradient(45deg, rgba(155, 89, 182, 0.2), rgba(142, 68, 173, 0.2));
          color: #ffffff !important;
          font-weight: 600;
          border: 1px solid rgba(155, 89, 182, 0.5);
        }

        .nav-link:hover:not(.btn-myaccount) {
          background: rgba(155, 89, 182, 0.1);
          color: #ffffff !important;
          transform: translateY(-2px);
        }

        /* My Account Button - Matching home.jsx */
        .btn-myaccount {
          background: linear-gradient(45deg, #9b59b6, #8e44ad) !important;
          border: none !important;
          border-radius: 25px !important;
          color: white !important;
          padding: 0.5rem 1.5rem !important;
          margin: 0 5px !important;
          transition: all 0.3s ease !important;
          font-weight: 600 !important;
          box-shadow: 0 4px 12px rgba(155, 89, 182, 0.3) !important;
        }

        .btn-myaccount:hover {
          background: linear-gradient(45deg, #8e44ad, #9b59b6) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(155, 89, 182, 0.4) !important;
          color: white !important;
        }

        /* Custom Dropdown Styles - Matching home.jsx */
        .dropdown-custom-menu {
          position: absolute;
          top: 100%;
          right: 0;
          z-index: 1000;
          min-width: 240px;
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border: 1px solid rgba(155, 89, 182, 0.3);
          border-radius: 10px;
          padding: 0.75rem 0;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.5);
          margin-top: 8px;
          animation: dropdownFadeIn 0.2s ease-out;
        }

        @keyframes dropdownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-custom-header {
          padding: 0.75rem 1.5rem;
          border-bottom: 1px solid rgba(155, 89, 182, 0.2);
          margin-bottom: 0.5rem;
        }

        .dropdown-custom-item {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          color: #c0bfff;
          text-decoration: none;
          transition: all 0.2s ease;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          font-size: 0.95rem;
          cursor: pointer;
        }

        .dropdown-custom-item:hover {
          background: rgba(155, 89, 182, 0.1);
          color: #ffffff;
          padding-left: 2rem;
        }

        .dropdown-custom-divider {
          height: 1px;
          background: rgba(155, 89, 182, 0.2);
          margin: 0.5rem 0;
        }

        .badge.bg-purple {
          background: linear-gradient(45deg, #9b59b6, #8e44ad) !important;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .text-muted {
          color: #b8b8ff !important;
        }

        /* Dashboard Header - Matching home.jsx hero section */
        .dashboard-header {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          padding: 3rem 1.5rem;
          position: relative;
          overflow: hidden;
        }

        .dashboard-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 50%, rgba(155, 89, 182, 0.1) 0%, transparent 50%);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .dashboard-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 1rem;
        }

        .dashboard-header p {
          font-size: 1.2rem;
          color: #c0bfff;
        }

        .highlight {
          background: linear-gradient(45deg, #9b59b6, #8e44ad);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
          font-weight: 700;
        }

        /* Main Content */
        .dashboard-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          min-height: calc(100vh - 250px);
        }

        /* Footer - Matching home.jsx footer */
        .dashboard-footer {
          background: #12121a;
          color: #aaaaff;
          padding: 2rem 1.5rem 1rem;
          border-top: 1px solid #222238;
        }

        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .footer-links {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .footer-links span {
          color: #b8b8ff;
        }

        .footer-links strong {
          color: #d1b3ff;
        }

        /* Responsive Design */
        @media (max-width: 992px) {
          .nav-container {
            flex-direction: column;
            gap: 1rem;
          }

          .nav-links {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }

          .nav-link span {
            display: inline;
          }

          .dashboard-header h1 {
            font-size: 2rem;
          }

          .dashboard-header p {
            font-size: 1rem;
          }
        }

        @media (max-width: 768px) {
          .dashboard-logo {
            height: 50px;
          }

          .dashboard-brand {
            font-size: 1.25rem;
          }

          .nav-link {
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }

          .btn-myaccount {
            padding: 0.5rem 1rem !important;
            font-size: 0.9rem !important;
          }

          .dropdown-custom-menu {
            position: fixed;
            top: auto;
            right: 10px;
            left: 10px;
            width: calc(100% - 20px);
            margin-top: 5px;
          }

          .footer-content {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }

        @media (max-width: 576px) {
          .nav-links {
            flex-direction: column;
            width: 100%;
          }

          .nav-link {
            width: 100%;
            justify-content: center;
            margin: 0.25rem 0;
          }

          .dashboard-header {
            padding: 2rem 1rem;
          }

          .dashboard-header h1 {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </>
  );
};

export default UserDashboard;