// src/components/userend/register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

// Import your assets
import logo from '../../assets/logo.png';

const Register = () => {
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    whatsappNo: '',
    postalAddress: ''
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Initialize AOS animations
  useEffect(() => {
    const initAOS = async () => {
      if (typeof window !== 'undefined') {
        const AOS = (await import('aos')).default;
        AOS.init({
          duration: 800,
          once: true,
        });
      }
    };
    initAOS();
  }, []);
  
  // API base URL
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    // Client-side validation
    if (!formData.username || !formData.password || !formData.confirmPassword || 
        !formData.whatsappNo || !formData.postalAddress) {
      setError('All fields are required');
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.username)) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Password validation
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    // WhatsApp number validation
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.whatsappNo)) {
      setError('Please enter a valid WhatsApp number (10-15 digits)');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, formData);
      
      if (response.data.success) {
        setSuccess(' Registration successful! Redirecting to login...');
        
        // Store token in localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Registration error:', err);
      
      if (err.response) {
        setError(err.response.data.message || 'Registration failed');
      } else if (err.request) {
        setError('Unable to connect to server. Please check your connection.');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      {/* Add Fonts and external CSS */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <div className="register-container">
        {/* Navigation - Same as Home */}
        <nav className="navbar navbar-expand-lg navbar-dark px-4 home-nav">
          <div className="container-fluid">
            <a className="navbar-brand" href="/">
              <img src={logo} alt="Robonics Logo" className="logo-only" />
            </a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link" href="/">Home</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/about">About</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/projects">Projects</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/pricing">Pricing</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/contact">Contact</a>
                </li>
                <li className="nav-item auth-buttons">
                  <a className="nav-link btn-login" href="/login">
                    <i className="fas fa-sign-in-alt me-2"></i>
                    Log In
                  </a>
                </li>
                <li className="nav-item auth-buttons">
                  <a className="nav-link btn-signup active" href="/register">
                    <i className="fas fa-user-plus me-2"></i>
                    Register
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        {/* Main Registration Section */}
        <section className="register-section py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-8" data-aos="fade-up">
                <div className="register-card">
                  {/* Header */}
                  <div className="text-center mb-5">
                    <h1 className="register-title">
                      Register with <span className="highlight">Robonics</span> 
                    </h1>
                    <p className="register-subtitle">
                      Create your account to access exclusive solutions and innovations
                    </p>
                  </div>

                  {/* Error/Success Messages */}
                  {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                      <button type="button" className="btn-close" onClick={() => setError('')}></button>
                    </div>
                  )}
                  
                  {success && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                      <i className="fas fa-check-circle me-2"></i>
                      {success}
                    </div>
                  )}

                  {/* Registration Form */}
                  <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                    <div className="row g-4">
                      {/* Email Field */}
                      <div className="col-md-12" data-aos="fade-up" data-aos-delay="100">
                        <div className="form-group">
                          <label className="form-label">
                            <i className="fas fa-envelope me-2 text-primary"></i>
                            Email Address *
                          </label>
                          <input
                            type="email"
                            className="form-control form-control-lg"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            placeholder="Enter your email address"
                          />
                          
                        </div>
                      </div>

                      {/* Password Fields */}
                      <div className="col-md-6" data-aos="fade-up" data-aos-delay="150">
                        <div className="form-group">
                          <label className="form-label">
                            <i className="fas fa-lock me-2 text-primary"></i>
                            Password *
                          </label>
                          <div className="input-group">
                            <input
                              type={showPassword ? "text" : "password"}
                              className="form-control form-control-lg"
                              name="password"
                              value={formData.password}
                              onChange={handleChange}
                              required
                              disabled={loading}
                              minLength="6"
                              placeholder="Create a strong password"
                            />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                          </div>
                          <div className="form-text">
                            Must be at least 6 characters long
                          </div>
                        </div>
                      </div>

                      <div className="col-md-6" data-aos="fade-up" data-aos-delay="200">
                        <div className="form-group">
                          <label className="form-label">
                            <i className="fas fa-lock me-2 text-primary"></i>
                            Confirm Password *
                          </label>
                          <div className="input-group">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              className="form-control form-control-lg"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleChange}
                              required
                              disabled={loading}
                              placeholder="Re-enter your password"
                            />
                            <button
                              className="btn btn-outline-secondary"
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              <i className={`fas ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* WhatsApp Field */}
                      <div className="col-md-6" data-aos="fade-up" data-aos-delay="250">
                        <div className="form-group">
                          <label className="form-label">
                            <i className="fab fa-whatsapp me-2 text-success"></i>
                            WhatsApp Number *
                          </label>
                          <div className="input-group">
                            
                            <input
                              type="tel"
                              className="form-control form-control-lg"
                              name="whatsappNo"
                              value={formData.whatsappNo}
                              onChange={handleChange}
                              required
                              disabled={loading}
                              pattern="[0-9]{10,15}"
                              placeholder="077 123 4567"
                            />
                          </div>
                          
                        </div>
                      </div>

                      {/* Postal Address Field */}
                      <div className="col-md-6" data-aos="fade-up" data-aos-delay="300">
                        <div className="form-group">
                          <label className="form-label">
                            <i className="fas fa-home me-2 text-primary"></i>
                            Postal Address *
                          </label>
                          <textarea
                            className="form-control form-control-lg"
                            name="postalAddress"
                            value={formData.postalAddress}
                            onChange={handleChange}
                            required
                            disabled={loading}
                            rows="3"
                            placeholder="Enter your complete postal address for delivery"
                          />
                          
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="col-12" data-aos="fade-up" data-aos-delay="350">
                        <div className="d-grid gap-2">
                          <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Creating Account...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-rocket me-2"></i>
                               Register
                              </>
                            )}
                          </button>
                          
                          <div className="text-center mt-3">
                            <p className="text-muted mb-2">
                              By registering, you agree to our 
                              <a href="/terms" className="text-primary ms-1">Terms of Service</a> and 
                              <a href="/privacy" className="text-primary ms-1">Privacy Policy</a>
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>

                  {/* Divider */}
                  <div className="divider my-5" data-aos="fade-up">
                    <span className="divider-text">Already have an account?</span>
                  </div>

                  {/* Login Link */}
                  <div className="text-center" data-aos="fade-up" data-aos-delay="400">
                    
                    <Link to="/login" className="btn btn-outline-primary btn-lg">
                      <i className="fas fa-arrow-right-to-bracket me-2"></i>
                      Log In to Your Account
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - Same as Home */}
        <footer className="home-footer">
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <div className="footer-brand d-flex align-items-center mb-3">
                  <img src={logo} alt="Robonics Logo" className="logo-only me-2" />
                </div>
                <p>Leading the innovation in robotics and 3D drawing solutions.</p>
              </div>
              <div className="col-md-4">
                <h5>Quick Links</h5>
                <ul className="footer-links">
                  <li><a href="/about">About Us</a></li>
                  <li><a href="/projects">Our Projects</a></li>
                  <li><a href="/pricing">Our Pricing</a></li>
                  <li><a href="/book">Get a Quote</a></li>
                  <li><a href="/contact">Contact Us</a></li>
                </ul>
              </div>
              <div className="col-md-4">
                <h5>Contact Info</h5>
                <p>📍 Colombo, Sri Lanka</p>
                <p>📧 contact@robonics.com</p>
                <p>📞 +94 11 234 5678</p>
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

      {/* ========== STYLES START HERE ========== */}
      <style jsx>{`
        /* Register Container */
        .register-container {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(180deg, #0d0d14, #1a1a2e);
          color: #e0e0f0;
          min-height: 100vh;
        }

        /* Navigation - Same as Home */
        .home-nav {
          background-color: #1a1a2e !important;
          padding: 1rem 0;
        }

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

        .nav-link {
          color: #c0bfff !important;
          font-weight: 500;
          padding: 0.5rem 1rem;
          transition: all 0.3s ease;
          margin: 0 5px;
        }

        .nav-link.active {
          color: #ffffff !important;
          font-weight: bold;
          border-bottom: 2px solid #9b59b6;
        }

        .nav-link:hover:not(.btn-login):not(.btn-signup) {
          color: #ffffff !important;
          transform: translateY(-2px);
        }

        /* Auth Buttons */
        .auth-buttons {
          margin-left: 10px;
          display: flex;
          align-items: center;
        }

        .btn-login {
          background: transparent !important;
          border: 2px solid #5d8aa8 !important;
          border-radius: 25px !important;
          color: #5d8aa8 !important;
          padding: 0.5rem 1.5rem !important;
          margin: 0 5px !important;
          transition: all 0.3s ease !important;
          font-weight: 600 !important;
        }

        .btn-login:hover {
          background: rgba(93, 138, 168, 0.1) !important;
          color: #7bb4d8 !important;
          border-color: #7bb4d8 !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(93, 138, 168, 0.3) !important;
        }

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
        }

        .btn-signup:hover {
          background: linear-gradient(45deg, #219653, #27ae60) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4) !important;
          color: white !important;
        }

        /* Register Section */
        .register-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          position: relative;
          overflow: hidden;
          min-height: calc(100vh - 300px);
        }

        .register-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 80%, rgba(155, 89, 182, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(46, 204, 113, 0.1) 0%, transparent 50%);
        }

        .register-card {
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(155, 89, 182, 0.2);
          position: relative;
          overflow: hidden;
        }

        .register-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 100px;
          height: 100px;
          background: linear-gradient(45deg, #9b59b6, #8e44ad);
          border-radius: 0 0 0 100px;
          opacity: 0.1;
        }

        .register-title {
          font-size: 2.8rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: #ffffff;
          background: linear-gradient(45deg, #ffffff, #d1b3ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .highlight {
          background: linear-gradient(45deg, #9b59b6, #8e44ad);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          display: inline-block;
          font-weight: 700;
        }

        .register-subtitle {
          font-size: 1.2rem;
          color: #b8b8ff;
          margin-bottom: 2rem;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        /* Form Styling */
        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          color: #d1b3ff;
          font-weight: 600;
          margin-bottom: 0.5rem;
          display: block;
        }

        .form-control {
          background: #0d0d14 !important;
          border: 1px solid #3a3a5e !important;
          color: #ffffff !important;
          border-radius: 10px !important;
          padding: 0.75rem 1rem !important;
          transition: all 0.3s ease !important;
        }

        .form-control:focus {
          border-color: #9b59b6 !important;
          box-shadow: 0 0 0 0.25rem rgba(155, 89, 182, 0.25) !important;
          background: #151525 !important;
        }

        .form-control::placeholder {
          color: #6c757d !important;
        }

        .form-control:disabled {
          background: #1a1a2e !important;
          color: #6c757d !important;
        }

        .form-text {
          color: #8888cc;
          font-size: 0.85rem;
          margin-top: 0.25rem;
        }

        /* Input Group */
        .input-group-text {
          background: #9b59b6 !important;
          border: 1px solid #9b59b6 !important;
          color: white !important;
          border-radius: 10px 0 0 10px !important;
        }

        .input-group .btn-outline-secondary {
          border-color: #3a3a5e !important;
          color: #b8b8ff !important;
          border-radius: 0 10px 10px 0 !important;
        }

        .input-group .btn-outline-secondary:hover {
          background: #9b59b6 !important;
          color: white !important;
          border-color: #9b59b6 !important;
        }

        /* Alerts */
        .alert {
          border-radius: 10px !important;
          border: none !important;
          padding: 1rem 1.5rem !important;
        }

        .alert-danger {
          background: linear-gradient(45deg, #ff4757, #ff3838) !important;
          color: white !important;
        }

        .alert-success {
          background: linear-gradient(45deg, #27ae60, #2ecc71) !important;
          color: white !important;
        }

        /* Buttons */
        .btn-primary {
          background: linear-gradient(45deg, #9b59b6, #8e44ad) !important;
          border: none !important;
          border-radius: 50px !important;
          padding: 1rem 2rem !important;
          font-weight: 600 !important;
          font-size: 1.1rem !important;
          transition: all 0.3s ease !important;
          box-shadow: 0 8px 25px rgba(155, 89, 182, 0.3) !important;
        }

        .btn-primary:hover {
          transform: translateY(-3px) !important;
          box-shadow: 0 12px 30px rgba(155, 89, 182, 0.4) !important;
          color: white !important;
        }

        .btn-primary:disabled {
          opacity: 0.7 !important;
          transform: none !important;
        }

        .btn-outline-primary {
          border: 2px solid #9b59b6 !important;
          color: #9b59b6 !important;
          border-radius: 50px !important;
          padding: 0.8rem 2rem !important;
          font-weight: 600 !important;
          transition: all 0.3s ease !important;
        }

        .btn-outline-primary:hover {
          background: linear-gradient(45deg, #9b59b6, #8e44ad) !important;
          border-color: transparent !important;
          color: white !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 25px rgba(155, 89, 182, 0.3) !important;
        }

        /* Divider */
        .divider {
          position: relative;
          text-align: center;
        }

        .divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #9b59b6, transparent);
        }

        .divider-text {
          background: #222238;
          padding: 0 1.5rem;
          color: #d1b3ff;
          font-weight: 500;
          position: relative;
          z-index: 1;
        }

        /* Footer */
        .home-footer {
          background: #12121a;
          color: #aaaaff;
          padding: 3rem 0 1rem;
          margin-top: auto;
        }

        .footer-brand h5 {
          color: #d1b3ff;
          margin: 0;
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

        /* Links */
        a.text-primary {
          color: #d1b3ff !important;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        a.text-primary:hover {
          color: #ffffff !important;
          text-decoration: underline;
        }

        /* Text colors */
        .text-muted {
          color: #8888cc !important;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .register-title {
            font-size: 2.2rem;
          }
          
          .register-card {
            padding: 2rem;
          }
          
          .register-section {
            padding: 2rem 0;
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

        @media (max-width: 576px) {
          .register-title {
            font-size: 1.8rem;
          }
          
          .register-subtitle {
            font-size: 1rem;
          }
          
          .form-control-lg {
            font-size: 1rem !important;
          }
          
          .btn-lg {
            font-size: 1rem !important;
            padding: 0.75rem 1.5rem !important;
          }
        }

        /* Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .register-card {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
      {/* ========== STYLES END HERE ========== */}
    </>
  );
};

export default Register;