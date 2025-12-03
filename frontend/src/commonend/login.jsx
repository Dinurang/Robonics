
// // src/components/commonend/login.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../commonend/auth.jsx';
// import logo from '../../assets/logo.png';

// const Login = () => {
//   const navigate = useNavigate();
//   const { login, isAuthenticated, user, logout } = useAuth();
  
//   const [formData, setFormData] = useState({
//     username: '',
//     password: ''
//   });
  
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
  
//   // Initialize AOS animations
//   useEffect(() => {
//     const initAOS = async () => {
//       if (typeof window !== 'undefined') {
//         const AOS = (await import('aos')).default;
//         AOS.init({
//           duration: 800,
//           once: true,
//         });
//       }
//     };
//     initAOS();
    
//     // Redirect if already authenticated
//     if (isAuthenticated) {
//       navigate('/');
//     }
//   }, [isAuthenticated, navigate]);
  
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     if (error) setError('');
//   };
  
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
    
//     if (!formData.username || !formData.password) {
//       setError('Email and password are required');
//       return;
//     }
    
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.username)) {
//       setError('Please enter a valid email address');
//       return;
//     }
    
//     setLoading(true);
    
//     try {
//       const result = await login(formData.username, formData.password);
      
//       if (result.success) {
//         // Redirect based on role
//         const userRole = result.data.user.role;
//         switch(userRole) {
//           case 'Administrator':
//             navigate('/admin/dashboard');
//             break;
//           case 'Owner':
//             navigate('/owner/dashboard');
//             break;
//           case 'User':
//             navigate('/user/dashboard');
//             break;
//           default:
//             navigate('/');
//         }
//       } else {
//         setError(result.message);
//       }
//     } catch (error) {
//       setError('An unexpected error occurred. Please try again.');
//       console.error('Login error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <>
//       <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
//       <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
//       <link href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" rel="stylesheet" />
//       <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

//       <div className="login-container">
//         {/* Navigation */}
//         <nav className="navbar navbar-expand-lg navbar-dark px-4 home-nav">
//           <div className="container-fluid">
//             <Link className="navbar-brand" to="/">
//               <img src={logo} alt="Robonics Logo" className="logo-only" />
//             </Link>
//             <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
//               <span className="navbar-toggler-icon"></span>
//             </button>
//             <div className="collapse navbar-collapse" id="navbarNav">
//               <ul className="navbar-nav ms-auto">
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/">Home</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/about">About</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/projects">Projects</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/pricing">Pricing</Link>
//                 </li>
//                 <li className="nav-item">
//                   <Link className="nav-link" to="/contact">Contact</Link>
//                 </li>
                
//                 {/* Conditional Auth Buttons */}
//                 {!isAuthenticated ? (
//                   <>
//                     <li className="nav-item auth-buttons">
//                       <Link className="nav-link btn-login active" to="/login">
//                         <i className="fas fa-sign-in-alt me-2"></i>
//                         Log In
//                       </Link>
//                     </li>
//                     <li className="nav-item auth-buttons">
//                       <Link className="nav-link btn-signup" to="/register">
//                         <i className="fas fa-user-plus me-2"></i>
//                         Register
//                       </Link>
//                     </li>
//                   </>
//                 ) : (
//                   <li className="nav-item dropdown auth-buttons">
//                     <a className="nav-link dropdown-toggle btn-myaccount" 
//                        href="#" 
//                        id="navbarDropdown" 
//                        role="button" 
//                        data-bs-toggle="dropdown" 
//                        aria-expanded="false">
//                       <i className="fas fa-user-circle me-2"></i>
//                       My Account
//                     </a>
//                     <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown"> 
//                       <li>
//                         <span className="dropdown-item-text">
//                           <small>Logged in as</small>
//                           <br />
//                           <strong>{user?.username}</strong>
//                           <br />
//                           <small className="text-muted">{user?.role}</small>
//                         </span>
//                       </li>
//                       <li><hr className="dropdown-divider" /></li>
//                       <li>
//                         <Link className="dropdown-item" to="/profile">
//                           <i className="fas fa-user me-2"></i>
//                           Profile
//                         </Link>
//                       </li>
//                       {user?.role === 'Administrator' || user?.role === 'Owner' ? (
//                         <li>
//                           <Link className="dropdown-item" to="/admin/dashboard">
//                             <i className="fas fa-tachometer-alt me-2"></i>
//                             Dashboard
//                           </Link>
//                         </li>
//                       ) : (
//                         <li>
//                           <Link className="dropdown-item" to="/user/dashboard">
//                             <i className="fas fa-tachometer-alt me-2"></i>
//                             Dashboard
//                           </Link>
//                         </li>
//                       )}
//                       <li>
//                         <Link className="dropdown-item" to="/settings">
//                           <i className="fas fa-cog me-2"></i>
//                           Settings
//                         </Link>
//                       </li>
//                       <li><hr className="dropdown-divider" /></li>
//                       <li>
//                         <button className="dropdown-item text-danger" onClick={() => {
//                           logout();
//                           navigate('/');
//                         }}>
//                           <i className="fas fa-sign-out-alt me-2"></i>
//                           Logout
//                         </button>
//                       </li>
//                     </ul>
//                   </li>
//                 )}
//               </ul>
//             </div>
//           </div>
//         </nav>

//         {/* Login Section */}
//         <section className="login-section py-5">
//           <div className="container">
//             <div className="row justify-content-center">
//               <div className="col-lg-6 col-md-8" data-aos="fade-up">
//                 <div className="login-card">
//                   {/* Header */}
//                   <div className="text-center mb-5">
//                     <h1 className="login-title">
//                       Login with <span className="highlight">Robonics</span>
//                     </h1>
                    
//                   </div>

//                   {/* Error Message */}
//                   {error && (
//                     <div className="alert alert-danger alert-dismissible fade show" role="alert">
//                       <i className="fas fa-exclamation-circle me-2"></i>
//                       {error}
//                       <button type="button" className="btn-close" onClick={() => setError('')}></button>
//                     </div>
//                   )}

//                   {/* Login Form */}
//                   <form onSubmit={handleSubmit} className="needs-validation" noValidate>
//                     {/* Email Field */}
//                     <div className="form-group mb-4" data-aos="fade-up" data-aos-delay="100">
//                       <label className="form-label">
//                         <i className="fas fa-envelope me-2 text-primary"></i>
//                         Email Address *
//                       </label>
//                       <input
//                         type="email"
//                         className="form-control form-control-lg"
//                         name="username"
//                         value={formData.username}
//                         onChange={handleChange}
//                         required
//                         disabled={loading}
//                         placeholder="Enter your email address"
//                       />
//                     </div>

//                     {/* Password Field */}
//                     <div className="form-group mb-4" data-aos="fade-up" data-aos-delay="150">
//                       <label className="form-label">
//                         <i className="fas fa-lock me-2 text-primary"></i>
//                         Password *
//                       </label>
//                       <div className="input-group">
//                         <input
//                           type={showPassword ? "text" : "password"}
//                           className="form-control form-control-lg"
//                           name="password"
//                           value={formData.password}
//                           onChange={handleChange}
//                           required
//                           disabled={loading}
//                           placeholder="Enter your password"
//                         />
//                         <button
//                           className="btn btn-outline-secondary"
//                           type="button"
//                           onClick={() => setShowPassword(!showPassword)}
//                         >
//                           <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
//                         </button>
//                       </div>
//                       <div className="text-end mt-2">
//                         <Link to="/forgot-password" className="text-primary text-decoration-none">
//                           <i className="fas fa-key me-1"></i>
//                           Forgot Password?
//                         </Link>
//                       </div>
//                     </div>

//                     {/* Submit Button */}
//                     <div className="form-group" data-aos="fade-up" data-aos-delay="200">
//                       <div className="d-grid gap-2">
//                         <button
//                           type="submit"
//                           className="btn btn-primary btn-lg"
//                           disabled={loading}
//                         >
//                           {loading ? (
//                             <>
//                               <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//                               Signing In...
//                             </>
//                           ) : (
//                             <>
//                               <i className="fas fa-sign-in-alt me-2"></i>
//                               Login
//                             </>
//                           )}
//                         </button>
//                       </div>
//                     </div>
//                   </form>

//                   {/* Divider */}
//                   <div className="divider my-5" data-aos="fade-up" data-aos-delay="250">
//                     <span className="divider-text">Don't have account?</span>
//                   </div>

//                   {/* Register Link */}
//                   <div className="text-center" data-aos="fade-up" data-aos-delay="300">
//                     <Link to="/register" className="btn btn-outline-primary btn-lg">
//                       <i className="fas fa-user-plus me-2"></i>
//                       Create New Account
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         {/* Footer */}
//         <footer className="home-footer">
//           <div className="container">
//             <div className="row">
//               <div className="col-md-4">
//                 <div className="footer-brand d-flex align-items-center mb-3">
//                   <img src={logo} alt="Robonics Logo" className="logo-only me-2" />
//                 </div>
//                 <p>Leading the innovation in robotics and 3D drawing solutions.</p>
//               </div>
//               <div className="col-md-4">
//                 <h5>Quick Links</h5>
//                 <ul className="footer-links">
//                   <li><Link to="/about">About Us</Link></li>
//                   <li><Link to="/projects">Our Projects</Link></li>
//                   <li><Link to="/pricing">Our Pricing</Link></li>
//                   <li><Link to="/book">Get a Quote</Link></li>
//                   <li><Link to="/contact">Contact Us</Link></li>
//                 </ul>
//               </div>
//               <div className="col-md-4">
//                 <h5>Contact Info</h5>
//                 <p>📍 Colombo, Sri Lanka</p>
//                 <p>📧 contact@robonics.com</p>
//                 <p>📞 +94 11 234 5678</p>
//               </div>
//             </div>
//             <div className="footer-bottom text-center mt-4 pt-3 border-top">
//               <p>&copy; 2025 Robonics. All rights reserved.</p>
//             </div>
//           </div>
//         </footer>

//         <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
//       </div>

//       {/* ========== STYLES ========== */}
//       <style jsx>{`
//         /* Login Container */
//         .login-container {
//           font-family: 'Poppins', sans-serif;
//           background: linear-gradient(180deg, #0d0d14, #1a1a2e);
//           color: #e0e0f0;
//           min-height: 100vh;
//         }

//         /* Navigation - Same as Home */
//         .home-nav {
//           background-color: #1a1a2e !important;
//           padding: 1rem 0;
//         }

//         .logo-only {
//           height: 190px;
//           width: 250px;
//           border-radius: 12px;
//           padding: 4px;
//           background: linear-gradient(145deg, #222238, #1a1a2e);
//           box-shadow: 0 4px 12px rgba(155, 89, 182, 0.3);
//           transition: all 0.3s ease;
//         }

//         .logo-only:hover {
//           transform: scale(1.05);
//           border-color: #d1b3ff;
//           box-shadow: 0 6px 20px rgba(155, 89, 182, 0.5);
//         }

//         /* Navigation links */
//         .nav-link {
//           color: #c0bfff !important;
//           font-weight: 500;
//           padding: 0.5rem 1rem;
//           transition: all 0.3s ease;
//           margin: 0 5px;
//         }

//         .nav-link.active {
//           color: #ffffff !important;
//           font-weight: bold;
//           border-bottom: 2px solid #9b59b6;
//         }

//         /* Auth Buttons */
//         .auth-buttons {
//           margin-left: 10px;
//           display: flex;
//           align-items: center;
//         }

//         .btn-login {
//           background: transparent !important;
//           border: 2px solid #5d8aa8 !important;
//           border-radius: 25px !important;
//           color: #5d8aa8 !important;
//           padding: 0.5rem 1.5rem !important;
//           margin: 0 5px !important;
//           transition: all 0.3s ease !important;
//           font-weight: 600 !important;
//         }

//         .btn-login.active {
//           background: rgba(93, 138, 168, 0.1) !important;
//           color: #7bb4d8 !important;
//           border-color: #7bb4d8 !important;
//         }

//         .btn-login:hover {
//           background: rgba(93, 138, 168, 0.1) !important;
//           color: #7bb4d8 !important;
//           border-color: #7bb4d8 !important;
//           transform: translateY(-2px) !important;
//           box-shadow: 0 4px 12px rgba(93, 138, 168, 0.3) !important;
//         }

//         .btn-signup {
//           background: linear-gradient(45deg, #27ae60, #2ecc71) !important;
//           border: none !important;
//           border-radius: 25px !important;
//           color: white !important;
//           padding: 0.5rem 1.5rem !important;
//           margin: 0 5px !important;
//           transition: all 0.3s ease !important;
//           font-weight: 600 !important;
//           box-shadow: 0 4px 12px rgba(46, 204, 113, 0.3) !important;
//         }

//         .btn-signup:hover {
//           background: linear-gradient(45deg, #219653, #27ae60) !important;
//           transform: translateY(-2px) !important;
//           box-shadow: 0 6px 20px rgba(46, 204, 113, 0.4) !important;
//           color: white !important;
//         }

//         /* My Account Button (for Login page) */
//         .btn-myaccount {
//           background: linear-gradient(45deg, #9b59b6, #8e44ad) !important;
//           border: none !important;
//           border-radius: 25px !important;
//           color: white !important;
//           padding: 0.5rem 1.5rem !important;
//           margin: 0 5px !important;
//           transition: all 0.3s ease !important;
//           font-weight: 600 !important;
//           box-shadow: 0 4px 12px rgba(155, 89, 182, 0.3) !important;
//         }

//         .btn-myaccount:hover {
//           background: linear-gradient(45deg, #8e44ad, #9b59b6) !important;
//           transform: translateY(-2px) !important;
//           box-shadow: 0 6px 20px rgba(155, 89, 182, 0.4) !important;
//           color: white !important;
//         }

//         /* Dropdown Styling */
//         .dropdown-menu {
//           background: linear-gradient(145deg, #222238, #1a1a2e) !important;
//           border: 1px solid rgba(155, 89, 182, 0.3) !important;
//           box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important;
//         }

//         .dropdown-item {
//           color: #c0bfff !important;
//           transition: all 0.3s ease !important;
//           padding: 0.75rem 1.5rem !important;
//           text-decoration: none !important;
//           display: block !important;
//         }

//         .dropdown-item:hover {
//           background: rgba(155, 89, 182, 0.1) !important;
//           color: #ffffff !important;
//           padding-left: 2rem !important;
//         }

//         .dropdown-item-text {
//           color: #b8b8ff !important;
//           padding: 0.75rem 1.5rem !important;
//           display: block !important;
//         }

//         .dropdown-divider {
//           border-color: rgba(155, 89, 182, 0.3) !important;
//         }

//         /* Login Section */
//         .login-section {
//           padding: 4rem 0;
//           background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
//           position: relative;
//           overflow: hidden;
//           min-height: calc(100vh - 300px);
//         }

//         .login-section::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background: 
//             radial-gradient(circle at 20% 80%, rgba(155, 89, 182, 0.1) 0%, transparent 50%),
//             radial-gradient(circle at 80% 20%, rgba(46, 204, 113, 0.1) 0%, transparent 50%);
//         }

//         .login-card {
//           background: linear-gradient(145deg, #222238, #1a1a2e);
//           border-radius: 20px;
//           padding: 3rem;
//           box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
//           border: 1px solid rgba(155, 89, 182, 0.2);
//           position: relative;
//           overflow: hidden;
//         }

//         .login-card::before {
//           content: '';
//           position: absolute;
//           top: 0;
//           right: 0;
//           width: 100px;
//           height: 100px;
//           background: linear-gradient(45deg, #9b59b6, #8e44ad);
//           border-radius: 0 0 0 100px;
//           opacity: 0.1;
//         }

//         .login-title {
//           font-size: 2.5rem;
//           font-weight: 700;
//           margin-bottom: 1rem;
//           color: #ffffff;
//           background: linear-gradient(45deg, #ffffff, #d1b3ff);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//         }

//         .highlight {
//           background: linear-gradient(45deg, #9b59b6, #8e44ad);
//           -webkit-background-clip: text;
//           -webkit-text-fill-color: transparent;
//           display: inline-block;
//           font-weight: 700;
//         }

//         .login-subtitle {
//           font-size: 1.2rem;
//           color: #b8b8ff;
//           margin-bottom: 2rem;
//         }

//         /* Form Styling */
//         .form-group {
//           margin-bottom: 1.5rem;
//         }

//         .form-label {
//           color: #d1b3ff;
//           font-weight: 600;
//           margin-bottom: 0.5rem;
//           display: block;
//         }

//         .form-control {
//           background: #0d0d14 !important;
//           border: 1px solid #3a3a5e !important;
//           color: #ffffff !important;
//           border-radius: 10px !important;
//           padding: 0.75rem 1rem !important;
//           transition: all 0.3s ease !important;
//         }

//         .form-control:focus {
//           border-color: #9b59b6 !important;
//           box-shadow: 0 0 0 0.25rem rgba(155, 89, 182, 0.25) !important;
//           background: #151525 !important;
//         }

//         .form-control::placeholder {
//           color: #6c757d !important;
//         }

//         .form-control:disabled {
//           background: #1a1a2e !important;
//           color: #6c757d !important;
//         }

//         /* Input Group */
//         .input-group .btn-outline-secondary {
//           border-color: #3a3a5e !important;
//           color: #b8b8ff !important;
//           border-radius: 0 10px 10px 0 !important;
//         }

//         .input-group .btn-outline-secondary:hover {
//           background: #9b59b6 !important;
//           color: white !important;
//           border-color: #9b59b6 !important;
//         }

//         /* Alerts */
//         .alert {
//           border-radius: 10px !important;
//           border: none !important;
//           padding: 1rem 1.5rem !important;
//         }

//         .alert-danger {
//           background: linear-gradient(45deg, #ff4757, #ff3838) !important;
//           color: white !important;
//         }

//         /* Buttons */
//         .btn-primary {
//           background: linear-gradient(45deg, #9b59b6, #8e44ad) !important;
//           border: none !important;
//           border-radius: 50px !important;
//           padding: 1rem 2rem !important;
//           font-weight: 600 !important;
//           font-size: 1.1rem !important;
//           transition: all 0.3s ease !important;
//           box-shadow: 0 8px 25px rgba(155, 89, 182, 0.3) !important;
//         }

//         .btn-primary:hover {
//           transform: translateY(-3px) !important;
//           box-shadow: 0 12px 30px rgba(155, 89, 182, 0.4) !important;
//           color: white !important;
//         }

//         .btn-primary:disabled {
//           opacity: 0.7 !important;
//           transform: none !important;
//         }

//         .btn-outline-primary {
//           border: 2px solid #9b59b6 !important;
//           color: #9b59b6 !important;
//           border-radius: 50px !important;
//           padding: 0.8rem 2rem !important;
//           font-weight: 600 !important;
//           transition: all 0.3s ease !important;
//         }

//         .btn-outline-primary:hover {
//           background: linear-gradient(45deg, #9b59b6, #8e44ad) !important;
//           border-color: transparent !important;
//           color: white !important;
//           transform: translateY(-2px) !important;
//           box-shadow: 0 8px 25px rgba(155, 89, 182, 0.3) !important;
//         }

//         /* Divider */
//         .divider {
//           position: relative;
//           text-align: center;
//         }

//         .divider::before {
//           content: '';
//           position: absolute;
//           top: 50%;
//           left: 0;
//           right: 0;
//           height: 1px;
//           background: linear-gradient(90deg, transparent, #9b59b6, transparent);
//         }

//         .divider-text {
//           background: #222238;
//           padding: 0 1.5rem;
//           color: #d1b3ff;
//           font-weight: 500;
//           position: relative;
//           z-index: 1;
//         }

//         /* Footer */
//         .home-footer {
//           background: #12121a;
//           color: #aaaaff;
//           padding: 3rem 0 1rem;
//           margin-top: auto;
//         }

//         .footer-links {
//           list-style: none;
//           padding: 0;
//         }

//         .footer-links li {
//           margin-bottom: 0.5rem;
//         }

//         .footer-links a {
//           color: #aaaaff;
//           text-decoration: none;
//           transition: all 0.3s ease;
//         }

//         .footer-links a:hover {
//           color: #d1b3ff;
//           padding-left: 5px;
//         }

//         .footer-bottom {
//           border-top: 1px solid #222238 !important;
//         }

//         /* Links */
//         a.text-primary {
//           color: #d1b3ff !important;
//           text-decoration: none;
//           transition: all 0.3s ease;
//         }

//         a.text-primary:hover {
//           color: #ffffff !important;
//           text-decoration: underline;
//         }

//         /* Responsive */
//         @media (max-width: 768px) {
//           .login-title {
//             font-size: 2rem;
//           }
          
//           .login-card {
//             padding: 2rem;
//           }
          
//           .login-section {
//             padding: 2rem 0;
//           }
          
//           .auth-buttons {
//             margin-left: 0;
//             margin-top: 10px;
//           }
          
//           .btn-login, .btn-signup, .btn-myaccount {
//             display: inline-block;
//             margin: 5px !important;
//             font-size: 0.9rem !important;
//             padding: 0.4rem 1rem !important;
//           }
          
//           .logo-only {
//             height: 150px;
//             width: 200px;
//           }
//         }
//       `}</style>
//     </>
//   );
// };

// export default Login;



import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../commonend/auth.jsx';
import logo from '../../assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, user, logout } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
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
    
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.password) {
      setError('Email and password are required');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.username)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        // Redirect based on role
        const userRole = result.data.user.role;
        switch(userRole) {
          case 'Administrator':
            navigate('/admin/dashboard');
            break;
          case 'Owner':
            navigate('/owner/dashboard');
            break;
          case 'User':
            navigate('/user/dashboard');
            break;
          default:
            navigate('/');
        }
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <div className="login-container">
        {/* Navigation */}
        <nav className="navbar navbar-expand-lg navbar-dark px-4 home-nav">
          <div className="container-fluid">
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
                
                {/* Conditional Auth Buttons - CORRECTED */}
                {!isAuthenticated ? (
                  <>
                    <li className="nav-item auth-buttons">
                      <Link className="nav-link btn-login active" to="/login">
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
                  </>
                ) : (
                  <li className="nav-item dropdown auth-buttons">
                    <a className="nav-link dropdown-toggle btn-myaccount" 
                       href="#" 
                       id="navbarDropdown" 
                       role="button" 
                       data-bs-toggle="dropdown" 
                       aria-expanded="false">
                      <i className="fas fa-user-circle me-2"></i>
                      My Account
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown"> 
                      <li>
                        <span className="dropdown-item-text">
                          <small>Logged in as</small>
                          <br />
                          <strong>{user?.username}</strong>
                          <br />
                          <small className="text-muted">{user?.role}</small>
                        </span>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <Link className="dropdown-item" to="/profile">
                          <i className="fas fa-user me-2"></i>
                          Profile
                        </Link>
                      </li>
                      {/* CORRECTED: Using /dashboard instead of hardcoded routes */}
                      <li>
                        <Link className="dropdown-item" to="/dashboard">
                          <i className="fas fa-tachometer-alt me-2"></i>
                          Go to Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" to="/settings">
                          <i className="fas fa-cog me-2"></i>
                          Settings
                        </Link>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button className="dropdown-item text-danger" onClick={() => {
                          logout();
                          navigate('/');
                        }}>
                          <i className="fas fa-sign-out-alt me-2"></i>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </nav>

        {/* Login Section */}
        <section className="login-section py-5">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-8" data-aos="fade-up">
                <div className="login-card">
                  {/* Header */}
                  <div className="text-center mb-5">
                    <h1 className="login-title">
                      Login with <span className="highlight">Robonics</span>
                    </h1>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                      <button type="button" className="btn-close" onClick={() => setError('')}></button>
                    </div>
                  )}

                  {/* Login Form */}
                  <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                    {/* Email Field */}
                    <div className="form-group mb-4" data-aos="fade-up" data-aos-delay="100">
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

                    {/* Password Field */}
                    <div className="form-group mb-4" data-aos="fade-up" data-aos-delay="150">
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
                          placeholder="Enter your password"
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                      <div className="text-end mt-2">
                        <Link to="/forgot-password" className="text-primary text-decoration-none">
                          <i className="fas fa-key me-1"></i>
                          Forgot Password?
                        </Link>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="form-group" data-aos="fade-up" data-aos-delay="200">
                      <div className="d-grid gap-2">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Signing In...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-sign-in-alt me-2"></i>
                              Login
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </form>

                  {/* Divider */}
                  <div className="divider my-5" data-aos="fade-up" data-aos-delay="250">
                    <span className="divider-text">Don't have account?</span>
                  </div>

                  {/* Register Link */}
                  <div className="text-center" data-aos="fade-up" data-aos-delay="300">
                    <Link to="/register" className="btn btn-outline-primary btn-lg">
                      <i className="fas fa-user-plus me-2"></i>
                      Create New Account
                    </Link>
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

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
      </div>

      {/* ========== STYLES ========== */}
      <style jsx>{`
        /* Login Container */
        .login-container {
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

        /* Navigation links */
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

        .btn-login.active {
          background: rgba(93, 138, 168, 0.1) !important;
          color: #7bb4d8 !important;
          border-color: #7bb4d8 !important;
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

        /* My Account Button */
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

        /* Dropdown Styling */
        .dropdown-menu {
          background: linear-gradient(145deg, #222238, #1a1a2e) !important;
          border: 1px solid rgba(155, 89, 182, 0.3) !important;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important;
        }

        .dropdown-item {
          color: #c0bfff !important;
          transition: all 0.3s ease !important;
          padding: 0.75rem 1.5rem !important;
          text-decoration: none !important;
          display: block !important;
        }

        .dropdown-item:hover {
          background: rgba(155, 89, 182, 0.1) !important;
          color: #ffffff !important;
          padding-left: 2rem !important;
        }

        .dropdown-item-text {
          color: #b8b8ff !important;
          padding: 0.75rem 1.5rem !important;
          display: block !important;
        }

        .dropdown-divider {
          border-color: rgba(155, 89, 182, 0.3) !important;
        }

        /* Login Section */
        .login-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          position: relative;
          overflow: hidden;
          min-height: calc(100vh - 300px);
        }

        .login-section::before {
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

        .login-card {
          background: linear-gradient(145deg, #222238, #1a1a2e);
          border-radius: 20px;
          padding: 3rem;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(155, 89, 182, 0.2);
          position: relative;
          overflow: hidden;
        }

        .login-card::before {
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

        .login-title {
          font-size: 2.5rem;
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

        /* Input Group */
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

        /* Responsive */
        @media (max-width: 768px) {
          .login-title {
            font-size: 2rem;
          }
          
          .login-card {
            padding: 2rem;
          }
          
          .login-section {
            padding: 2rem 0;
          }
          
          .auth-buttons {
            margin-left: 0;
            margin-top: 10px;
          }
          
          .btn-login, .btn-signup, .btn-myaccount {
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
      `}</style>
    </>
  );
};

export default Login;