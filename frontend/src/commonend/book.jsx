import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Import your images
import logo from '../../assets/logo.png';

const Book = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    projectType: '',
    budget: '',
    timeline: '',
    description: '',
    contactName: '',
    contactEmail: '',
    contactPhone: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    try {
      // Check if user is logged in (check localStorage or token)
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        setIsAuthenticated(true);
        setUserRole(user.role);
        
        // Pre-fill contact info if user is logged in
        setFormData(prev => ({
          ...prev,
          contactName: user.username || user.name || '',
          contactEmail: user.email || '',
          contactPhone: user.phone || user.whatsappNo || ''
        }));
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/book' } });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Booking form submitted:', formData);
      setSubmitStatus('success');
      setIsSubmitting(false);
      setFormData({
        projectType: '',
        budget: '',
        timeline: '',
        description: '',
        contactName: formData.contactName, // Keep contact info
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone
      });
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

  const handleLoginRedirect = () => {
    navigate('/login', { state: { from: '/book' } });
  };

  const handleRegisterRedirect = () => {
    navigate('/register', { state: { from: '/book' } });
  };

  if (loading) {
    return (
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
  }

  return (
    <>
      {/* Add Fonts and external CSS - EXACT SAME AS ABOUT */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <div className="book-container">
        {/* Navigation - EXACT SAME AS ABOUT */}
        <nav className="navbar navbar-expand-lg navbar-dark px-4 home-nav">
          <div className="container-fluid">
            {/* Logo only with rounded border - EXACT SAME AS ABOUT */}
            <Link className="navbar-brand" to="/">
              <img src={logo} alt="Robonics Logo" className="logo-only" />
            </Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">About</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/projects">Projects</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/pricing">Pricing</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact">Contact</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link active" to="/book">Book</Link>
                </li>
                
                {/* Auth Buttons - EXACT SAME AS ABOUT */}
                <li className="nav-item auth-buttons">
                  <Link className="nav-link btn-login" to="/login">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Log In
                  </Link>
                </li>
                <li className="nav-item auth-buttons">
                  <Link className="nav-link btn-signup" to="/register">
                    <i className="fas fa-user-plus me-2"></i>
                    Register
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Hero Section - EXACT SAME STRUCTURE AS ABOUT */}
        <section className="hero-section" data-aos="fade-up">
          <div className="container py-5">
            <div className="row align-items-center">
              <div className="col-lg-6" data-aos="fade-right">
                <h1 className="hero-title">
                  Book a <span className="highlight">Project</span>
                </h1>
                <p className="hero-subtitle">
                  Start Your Robotics Journey With Us
                </p>
                <p className="hero-description">
                  Ready to bring your robotics or automation idea to life? 
                  Fill out our booking form and our experts will contact you 
                  to discuss your project requirements, timeline, and budget.
                </p>
                
                {!isAuthenticated && (
                  <div className="auth-alert mt-4 p-3 rounded" style={{
                    backgroundColor: 'rgba(255, 193, 7, 0.1)',
                    border: '1px solid #ffc107',
                    color: '#ffc107'
                  }}>
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>Please log in or register to book a project.</strong>
                    <div className="mt-2">
                      <button onClick={handleLoginRedirect} className="btn btn-sm btn-warning me-2">
                        Log In
                      </button>
                      <button onClick={handleRegisterRedirect} className="btn btn-sm btn-success">
                        Register
                      </button>
                    </div>
                  </div>
                )}
                
                {isAuthenticated && (
                  <div className="auth-alert mt-4 p-3 rounded" style={{
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    border: '1px solid #2ecc71',
                    color: '#2ecc71'
                  }}>
                    <i className="fas fa-check-circle me-2"></i>
                    <strong>Welcome back! You're logged in as {userRole}.</strong>
                    <p className="mb-0 mt-1" style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                      You can now submit your project booking request.
                    </p>
                  </div>
                )}
                
                
              </div>
              <div className="col-lg-6" data-aos="fade-left">
                <div className="hero-image-container">
                  <img src={logo} alt="Robonics Logo" className="hero-image" />
                </div>
              </div>
            </div>
          </div>
        </section>

        

        

        {/* CTA Section - EXACT SAME AS ABOUT */}
        <section className="cta-section py-5" data-aos="fade-up">
          <div className="container text-center">
            <h2 className="mb-4">Have Questions Before Booking?</h2>
            <p className="cta-description mb-4">
              Contact our team for a free assistance and personalized project assessment.
            </p>
            <div className="cta-buttons">
              <Link to="/contact" className="btn btn-lg btn-primary me-3">
                Contact Us
              </Link>
              <Link to="/pricing" className="btn btn-lg btn-primary me-3">
                View Pricing
              </Link>
              <a href="tel:+94112345678" className="btn btn-lg btn-primary">
                Call Now
              </a>
            </div>
          </div>
        </section>

        {/* Footer - EXACT SAME AS ABOUT */}
        <footer className="home-footer">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <div className="footer-brand d-flex align-items-center mb-3">
                  <img src={logo} alt="Robonics Logo" className="logo-only me-2" />
                </div>
                <p>Leading the innovation in robotics and automation solutions.</p>
              </div>
              <div className="col-md-4">
                <h5>Quick Links</h5>
                <ul className="footer-links">
                  <li><Link to="/">Home</Link></li>
                  <li><Link to="/about">About Us</Link></li>
                  <li><Link to="/projects">Our Projects</Link></li>
                  <li><Link to="/pricing">Our Pricing</Link></li>
                  <li><Link to="/contact">Contact Us</Link></li>
                </ul>
              </div>
              <div className="col-md-4">
                <h5>Contact Info</h5>
                <p>📍 Colombo, Sri Lanka</p>
                <p>📧 contact@robonics.com</p>
                <p>📞 +94 11 234 5678</p>
                <p>🕒 Mon-Fri: 9:00 AM - 6:00 PM</p>
              </div>
            </div>
            <div className="footer-bottom text-center mt-4 pt-3 border-top">
              <p>&copy; 2025 Robonics. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Bootstrap & AOS Scripts */}
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
      </div>

      {/* ========== STYLES - EXACT SAME AS ABOUT ========== */}
      <style jsx>{`
        /* Book Container - EXACT SAME AS ABOUT */
        .book-container {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(180deg, #0d0d14, #1a1a2e);
          color: #e0e0f0;
          min-height: 100vh;
        }

        /* Navigation - EXACT SAME AS ABOUT */
        .home-nav {
          background-color: #1a1a2e !important;
          padding: 1rem 0;
        }

        /* Logo only with rounded border - EXACT SAME AS ABOUT */
        .logo-only {
          height: 190px;
          width: 250px;
          border-radius: 12px;
          padding: 4px;
          background: linear-gradient(145deg, #222238, #1a1a2e);
          box-shadow: 0 4px 12px rgba(155, 89, 182, 0.3);
          transition: all 0.3s ease;
        }

        .logo-only:hover {
          transform: scale(1.05);
          border-color: #d1b3ff;
          box-shadow: 0 6px 20px rgba(155, 89, 182, 0.5);
        }

        /* Regular navigation links - EXACT SAME AS ABOUT */
        .nav-link {
          color: #c0bfff !important;
          font-weight: 500;
          padding: 0.5rem 1rem;
          transition: all 0.3s ease;
          margin: 0 5px;
          text-decoration: none !important;
        }

        .nav-link.active {
          color: #ffffff !important;
          font-weight: bold;
          border-bottom: 2px solid #9b59b6;
        }

        .nav-link:hover:not(.btn-login):not(.btn-signup):not(.btn-myaccount) {
          color: #ffffff !important;
          transform: translateY(-2px);
        }

        /* Auth Buttons Container - EXACT SAME AS ABOUT */
        .auth-buttons {
          margin-left: 10px;
          display: flex;
          align-items: center;
        }

        /* Login Button - Blue/Purple Outline - EXACT SAME AS ABOUT */
        .btn-login {
          background: transparent !important;
          border: 2px solid #5d8aa8 !important;
          border-radius: 25px !important;
          color: #5d8aa8 !important;
          padding: 0.5rem 1.5rem !important;
          margin: 0 5px !important;
          transition: all 0.3s ease !important;
          font-weight: 600 !important;
          text-decoration: none !important;
          display: inline-block;
        }

        .btn-login:hover {
          background: rgba(93, 138, 168, 0.1) !important;
          color: #7bb4d8 !important;
          border-color: #7bb4d8 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(93, 138, 168, 0.3) !important;
        }

        /* Sign Up Button - Green Gradient - EXACT SAME AS ABOUT */
        .btn-signup {
          background: linear-gradient(45deg, #27ae60, #2ecc71) !important;
          border: none !important;
          border-radius: 25px !important;
          color: white !important;
          padding: 0.5rem 1.5rem !important;
          margin: 0 5px !important;
          transition: all 0.3s ease !important;
          font-weight: 600 !important;
          box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3) !important;
          text-decoration: none !important;
          display: inline-block;
        }

        .btn-signup:hover {
          background: linear-gradient(45deg, #219653, #27ae60) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4) !important;
          color: white !important;
        }

        /* Hero Section - EXACT SAME AS ABOUT */
        .hero-section {
          padding: 5rem 0;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 30% 50%, rgba(155, 89, 182, 0.1) 0%, transparent 50%);
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          color: #c0bfff;
          margin-bottom: 1.5rem;
        }

        .hero-description {
          font-size: 1.1rem;
          line-height: 1.8;
          color: #b8b8ff;
          margin-bottom: 2rem;
          max-width: 600px;
        }

        .highlight {
          background: linear-gradient(45deg, #9b59b6, #8e44ad);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
          font-weight: 700;
        }

        .hero-buttons .btn {
          padding: 0.8rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        .btn-primary {
          background: linear-gradient(45deg, #9b59b6, #8e44ad);
          border: none;
          box-shadow: 0 4px 15px rgba(155, 89, 182, 0.3);
          color: white !important;
        }

        .btn-primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(155, 89, 182, 0.4);
          color: white;
        }

        .btn-outline-light {
          border: 2px solid #8e44ad;
          color: #8e44ad !important;
          background: transparent;
        }

        .btn-outline-light:hover {
          background: linear-gradient(45deg, #9b59b6, #8e44ad);
          border-color: transparent;
          color: white !important;
        }

        .hero-image-container {
          position: relative;
          text-align: center;
        }

        .hero-image {
          max-width: 100%;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        /* Features Section - EXACT SAME AS ABOUT */
        .features-section {
          background-color: #151525;
        }

        .feature-card {
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border-radius: 15px;
          padding: 2rem;
          height: 100%;
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }

        .feature-card:hover {
          transform: translateY(-10px);
          border-color: #9b59b6;
          box-shadow: 0 15px 30px rgba(155, 89, 182, 0.2);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-card h3 {
          color: #d1b3ff;
          margin-bottom: 1rem;
        }

        .feature-card p {
          color: #b8b8ff;
          line-height: 1.6;
        }

        /* Showcase Section - EXACT SAME AS ABOUT */
        .showcase-section {
          background: linear-gradient(180deg, #151525, #0d0d14);
        }

        .showcase-card {
          background: #222238;
          border-radius: 15px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .showcase-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
        }

        .showcase-card h4 {
          color: #d1b3ff;
          margin-bottom: 0.5rem;
        }

        .showcase-card p {
          color: #b8b8ff;
          font-size: 0.9rem;
        }

        /* Form Styles */
        .form-control:focus {
          background-color: #1a1a2e;
          border-color: #9b59b6;
          box-shadow: 0 0 0 0.25rem rgba(155, 89, 182, 0.25);
          color: #e0e0f0;
        }

        .form-control:disabled {
          background-color: #151525 !important;
          color: #666 !important;
          cursor: not-allowed;
        }

        .alert-warning {
          background-color: rgba(255, 193, 7, 0.1);
          border-color: #ffc107;
          color: #ffc107;
        }

        .alert-success {
          background-color: rgba(46, 204, 113, 0.1);
          border-color: #27ae60;
          color: #2ecc71;
        }

        .alert-link {
          color: #9b59b6 !important;
          text-decoration: none;
        }

        .alert-link:hover {
          text-decoration: underline;
        }

        /* CTA Section - EXACT SAME AS ABOUT */
        .cta-section {
          background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
          color: white;
        }

        .cta-description {
          font-size: 1.2rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .cta-buttons .btn-lg {
          padding: 1rem 2.5rem;
          border-radius: 50px;
          font-weight: 600;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }

        /* Footer - EXACT SAME AS ABOUT */
        .home-footer {
          background: #12121a;
          color: #aaaaff;
          padding: 3rem 0 1rem;
        }

        .footer-links {
          list-style: none;
          padding: 0;
        }

        .footer-links li {
          margin-bottom: 0.5rem;
        }

        .footer-links a {
          color: #aaaaff;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .footer-links a:hover {
          color: #d1b3ff;
          padding-left: 5px;
        }

        .footer-bottom {
          border-top: 1px solid #222238 !important;
        }

        /* Responsive Design - EXACT SAME AS ABOUT */
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }
          
          .hero-subtitle {
            font-size: 1.2rem;
          }
          
          .hero-buttons .btn {
            display: block;
            width: 100%;
            margin-bottom: 1rem;
          }
          
          .hero-buttons .btn.me-3 {
            margin-right: 0 !important;
          }
          
          .cta-buttons .btn-lg {
            display: block;
            width: 100%;
            margin-bottom: 1rem;
          }
          
          .cta-buttons .btn-lg.me-3 {
            margin-right: 0 !important;
          }

          .auth-buttons {
            margin-left: 0;
            margin-top: 10px;
          }
          
          .btn-login, .btn-signup {
            display: inline-block;
            margin: 5px !important;
            font-size: 0.9rem !important;
            padding: 0.4rem 1rem !important;
          }
          
          .logo-only {
            height: 150px;
            width: 200px;
          }
        }

        /* Custom spacing - EXACT SAME AS ABOUT */
        .py-5 {
          padding-top: 3rem !important;
          padding-bottom: 3rem !important;
        }

        .mb-5 {
          margin-bottom: 3rem !important;
        }

        .mt-4 {
          margin-top: 1.5rem !important;
        }

        .g-4 {
          gap: 1.5rem !important;
        }

        .g-5 {
          gap: 3rem !important;
        }

        /* Text colors - EXACT SAME AS ABOUT */
        .text-white {
          color: #ffffff !important;
        }

        .text-center {
          text-align: center !important;
        }
      `}</style>
    </>
  );
};

export default Book;