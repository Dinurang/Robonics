// Register.jsx - React Component 
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import your images
import logo from '../../assets/logo.png';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        whatsappNo: '',
        postalAddress: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Initialize AOS animations
    useEffect(() => {
        const initAOS = async () => {
            if (typeof window !== 'undefined') {
                const AOS = (await import('aos')).default;
                const AOSStyles = await import('aos/dist/aos.css');
                AOS.init({
                    duration: 1000,
                    once: true,
                });
            }
        };
        initAOS();
    }, []);
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };
    
    const validateForm = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[0-9]{10,15}$/;
        
        // Email validation
        if (!formData.username.trim()) {
            newErrors.username = 'Email is required';
        } else if (!emailRegex.test(formData.username)) {
            newErrors.username = 'Please enter a valid email address';
        }
        
        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        
        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        
        // WhatsApp number validation
        if (!formData.whatsappNo.trim()) {
            newErrors.whatsappNo = 'WhatsApp number is required';
        } else if (!phoneRegex.test(formData.whatsappNo)) {
            newErrors.whatsappNo = 'Please enter a valid phone number (10-15 digits)';
        }
        
        // Postal address validation
        if (!formData.postalAddress.trim()) {
            newErrors.postalAddress = 'Postal address is required';
        } else if (formData.postalAddress.trim().length < 10) {
            newErrors.postalAddress = 'Please enter a complete address';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsSubmitting(true);
        
        try {
            // Prepare user data
            const userData = {
                username: formData.username.trim(),
                password: formData.password,
                whatsappNo: formData.whatsappNo.trim(),
                postalAddress: formData.postalAddress.trim(),
                role: 'User'
            };
            
            console.log('Registration data:', userData);
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            alert('Registration successful!');
            
            // Reset form
            setFormData({
                username: '',
                password: '',
                confirmPassword: '',
                whatsappNo: '',
                postalAddress: ''
            });
            setErrors({});
            
        } catch (error) {
            console.error('Registration error:', error);
            alert('Registration failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    return (
        <>
            {/* Add Fonts and external CSS */}
            <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
            <link href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" rel="stylesheet" />

            <div className="register-page-container">
                {/* Navigation */}
                <nav className="navbar navbar-expand-lg navbar-dark px-4 home-nav">
                    <div className="container-fluid">
                        {/* Logo only with rounded border */}
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
                                    <Link className="nav-link" to="/book">Book</Link>
                                </li>
                                {/* Auth Buttons with different styling */}
                                <li className="nav-item auth-buttons">
                                    <Link className="nav-link btn-login" to="/login">Log In</Link>
                                </li>
                                <li className="nav-item auth-buttons">
                                    <Link className="nav-link btn-signup active" to="/register">Register</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav>

                {/* Registration Section */}
                <section className="register-section py-5" data-aos="fade-up">
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8 col-xl-6">
                                <div className="register-card">
                                    <div className="text-center mb-4">
                                        <h2 className="register-title">
                                            Register with <span className="highlight">Robonics</span>
                                        </h2>
                                        <p className="register-subtitle">
                                            Create your account to access our robotic solutions
                                        </p>
                                    </div>
                                    
                                    <form onSubmit={handleSubmit} className="register-form">
                                        <div className="row g-4">
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label htmlFor="username" className="form-label">
                                                        Email Address <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        id="username"
                                                        name="username"
                                                        value={formData.username}
                                                        onChange={handleChange}
                                                        placeholder="example@email.com"
                                                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                                                        required
                                                    />
                                                    {errors.username && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.username}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="password" className="form-label">
                                                        Password <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="password"
                                                        id="password"
                                                        name="password"
                                                        value={formData.password}
                                                        onChange={handleChange}
                                                        placeholder="At least 6 characters"
                                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                        required
                                                    />
                                                    {errors.password && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.password}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="col-md-6">
                                                <div className="form-group">
                                                    <label htmlFor="confirmPassword" className="form-label">
                                                        Confirm Password <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="password"
                                                        id="confirmPassword"
                                                        name="confirmPassword"
                                                        value={formData.confirmPassword}
                                                        onChange={handleChange}
                                                        placeholder="Re-enter your password"
                                                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                                        required
                                                    />
                                                    {errors.confirmPassword && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.confirmPassword}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label htmlFor="whatsappNo" className="form-label">
                                                        WhatsApp Number <span className="text-danger">*</span>
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        id="whatsappNo"
                                                        name="whatsappNo"
                                                        value={formData.whatsappNo}
                                                        onChange={handleChange}
                                                        placeholder="0778812345"
                                                        className={`form-control ${errors.whatsappNo ? 'is-invalid' : ''}`}
                                                        required
                                                    />
                                                    {errors.whatsappNo && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.whatsappNo}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="col-md-12">
                                                <div className="form-group">
                                                    <label htmlFor="postalAddress" className="form-label">
                                                        Postal Address <span className="text-danger">*</span>
                                                    </label>
                                                    <textarea
                                                        id="postalAddress"
                                                        name="postalAddress"
                                                        value={formData.postalAddress}
                                                        onChange={handleChange}
                                                        placeholder="123 Main Street, City, Country"
                                                        rows="3"
                                                        className={`form-control ${errors.postalAddress ? 'is-invalid' : ''}`}
                                                        required
                                                    />
                                                    {errors.postalAddress && (
                                                        <div className="invalid-feedback d-block">
                                                            {errors.postalAddress}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="col-12">
                                                <div className="form-check mb-4">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="terms"
                                                        required
                                                    />
                                                    <label className="form-check-label" htmlFor="terms">
                                                        I agree to the <a href="/terms" className="highlight-link">Terms & Conditions</a> and <a href="/privacy" className="highlight-link">Privacy Policy</a>
                                                    </label>
                                                </div>
                                                
                                                <button 
                                                    type="submit" 
                                                    className="btn btn-primary w-100 py-3"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Creating Account...
                                                        </>
                                                    ) : (
                                                        'Create Account'
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </form>
                                    
                                    <div className="text-center mt-4">
                                        <p className="mb-0">
                                            Already have an account?{' '}
                                            <Link to="/login" className="highlight-link">
                                                Log In
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
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
                                    <li><Link to="/about">About Us</Link></li>
                                    <li><Link to="/projects">Our Projects</Link></li>
                                    <li><Link to="/pricing">Our Pricing</Link></li>
                                    <li><Link to="/book">Get a Quote</Link></li>
                                    <li><Link to="/contact">Contact Us</Link></li>
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
            </div>

            {/* ========== STYLES START HERE ========== */}
            <style jsx>{`
                /* Register Page Container */
                .register-page-container {
                    font-family: 'Poppins', sans-serif;
                    background: linear-gradient(180deg, #0d0d14, #1a1a2e);
                    color: #e0e0f0;
                    min-height: 100vh;
                }

                /* Navigation */
                .home-nav {
                    background-color: #1a1a2e !important;
                    padding: 1rem 0;
                }

                /* Logo only with rounded border */
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

                /* Regular navigation links */
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

                /* Auth Buttons Container */
                .auth-buttons {
                    margin-left: 10px;
                    display: flex;
                    align-items: center;
                }

                /* Login Button - Blue/Purple Outline */
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

                /* Sign Up Button - Green Gradient */
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

                .btn-signup:hover, .btn-signup.active {
                    background: linear-gradient(45deg, #219653, #27ae60) !important;
                    transform: translateY(-2px) !important;
                    box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4) !important;
                    color: white !important;
                }

                /* Register Section */
                .register-section {
                    min-height: calc(100vh - 200px);
                    display: flex;
                    align-items: center;
                    padding: 4rem 0;
                }

                .register-card {
                    background: linear-gradient(145deg, #222238, #1a1a2e);
                    border-radius: 20px;
                    padding: 3rem;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(155, 89, 182, 0.2);
                    transition: all 0.3s ease;
                }

                .register-card:hover {
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.4);
                    border-color: rgba(155, 89, 182, 0.3);
                }

                .register-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #ffffff;
                    margin-bottom: 0.5rem;
                }

                .register-subtitle {
                    font-size: 1.1rem;
                    color: #c0bfff;
                    margin-bottom: 2rem;
                }

                .highlight {
                    background: linear-gradient(45deg, #9b59b6, #8e44ad);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    display: inline-block;
                    font-weight: 700;
                }

                .highlight-link {
                    color: #9b59b6;
                    text-decoration: none;
                    transition: all 0.3s ease;
                }

                .highlight-link:hover {
                    color: #d1b3ff;
                    text-decoration: underline;
                }

                /* Form Styles */
                .form-label {
                    color: #d1b3ff;
                    font-weight: 500;
                    margin-bottom: 0.5rem;
                    font-size: 0.95rem;
                }

                .form-control {
                    background: rgba(255, 255, 255, 0.05);
                    border: 2px solid rgba(155, 89, 182, 0.2);
                    border-radius: 10px;
                    color: #ffffff;
                    padding: 0.75rem 1rem;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                }

                .form-control:focus {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: #9b59b6;
                    color: #ffffff;
                    box-shadow: 0 0 0 0.25rem rgba(155, 89, 182, 0.25);
                }

                .form-control::placeholder {
                    color: rgba(255, 255, 255, 0.4);
                }

                .form-control.is-invalid {
                    border-color: #e74c3c;
                }

                .form-control.is-invalid:focus {
                    border-color: #e74c3c;
                    box-shadow: 0 0 0 0.25rem rgba(231, 76, 60, 0.25);
                }

                .invalid-feedback {
                    color: #e74c3c;
                    font-size: 0.875rem;
                    margin-top: 0.25rem;
                }

                /* Checkbox */
                .form-check-input {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-color: rgba(155, 89, 182, 0.3);
                }

                .form-check-input:checked {
                    background-color: #9b59b6;
                    border-color: #9b59b6;
                }

                .form-check-label {
                    color: #c0bfff;
                }

                /* Button */
                .btn-primary {
                    background: linear-gradient(45deg, #9b59b6, #8e44ad);
                    border: none;
                    border-radius: 10px;
                    font-weight: 600;
                    letter-spacing: 0.5px;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(155, 89, 182, 0.3);
                }

                .btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(155, 89, 182, 0.4);
                    background: linear-gradient(45deg, #8e44ad, #9b59b6);
                }

                .btn-primary:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
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

                /* Responsive Design */
                @media (max-width: 768px) {
                    .register-section {
                        padding: 2rem 0;
                    }
                    
                    .register-card {
                        padding: 2rem 1.5rem;
                    }
                    
                    .register-title {
                        font-size: 2rem;
                    }
                    
                    .logo-only {
                        height: 120px;
                        width: 160px;
                    }
                    
                    .auth-buttons {
                        margin-left: 0;
                        margin-top: 10px;
                    }
                    
                    .btn-login, .btn-signup {
                        display: inline-block;
                        margin: 5px !important;
                    }
                    
                    .col-md-6 {
                        margin-bottom: 1rem;
                    }
                }

                @media (max-width: 576px) {
                    .register-card {
                        padding: 1.5rem;
                    }
                    
                    .register-title {
                        font-size: 1.75rem;
                    }
                    
                    .btn-login, .btn-signup {
                        padding: 0.4rem 1rem !important;
                        font-size: 0.9rem !important;
                    }
                }
            `}</style>
            {/* ========== STYLES END HERE ========== */}
        </>
    );
};

export default Register;