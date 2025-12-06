// About.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

// Import your images
import logo from '../../assets/logo.png';
import robotCar from '../../assets/robotcar.png';
import robotArm from '../../assets/robotarm.png';
import obstacleRobot from '../../assets/obstaclerobot.png';

const About = () => {
  // Initialize AOS animations
  useEffect(() => {
    const initAOS = async () => {
      if (typeof window !== 'undefined') {
        const AOS = (await import('aos')).default;
        AOS.init({
          duration: 1000,
          once: true,
        });
      }
    };
    initAOS();
  }, []);

  return (
    <>
      {/* Add Fonts and external CSS */}
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <link href="https://cdn.jsdelivr.net/npm/aos@2.3.4/dist/aos.css" rel="stylesheet" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

      <div className="about-container">
        {/* Navigation - EXACT SAME AS HOME */}
        <nav className="navbar navbar-expand-lg navbar-dark px-4 home-nav">
          <div className="container-fluid">
            {/* Logo only with rounded border - EXACT SAME AS HOME */}
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
                  <Link className="nav-link active" to="/about">About</Link>
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
                
                {/* Auth Buttons - EXACT SAME AS HOME */}
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

        {/* Hero Section - EXACT SAME STRUCTURE AS HOME */}
        <section className="hero-section" data-aos="fade-up">
          <div className="container py-5">
            <div className="row align-items-center">
              <div className="col-lg-6" data-aos="fade-right">
                <h1 className="hero-title">
                  About <span className="highlight">Robonics</span>
                </h1>
                <p className="hero-subtitle">
                  Pioneering the Future of Intelligent Robotics & Automation
                </p>
                <p className="hero-description">
                  Robonics is a Sri Lankan-born startup committed to creating cutting-edge intelligent systems 
                  for automation, robotics, and AI. With a team of passionate developers, engineers, and thinkers, 
                  we're building smarter, sustainable solutions for tomorrow's world.
                </p>
                <div className="hero-buttons mt-4">
                  <Link to="/projects" className="btn btn-primary me-3">
                    Explore Projects
                  </Link>
                  <Link to="/contact" className="btn btn-outline-light">
                    Contact Us
                  </Link>
                </div>
              </div>
              <div className="col-lg-6" data-aos="fade-left">
                <div className="hero-image-container">
                  <img src={logo} alt="Robonics Logo" className="hero-image" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - EXACT SAME STRUCTURE AS HOME */}
        <section className="features-section py-5">
          <div className="container">
            <h2 className="text-center mb-5" data-aos="fade-up">
              Our <span className="highlight">Mission & Vision</span>
            </h2>
            <div className="row g-4">
              <div className="col-md-6" data-aos="fade-up" data-aos-delay="100">
                <div className="feature-card">
                  <div className="feature-icon">🚀</div>
                  <h3>Our Mission</h3>
                  <p>To develop innovative, accessible, and intelligent robotics solutions that empower businesses 
                  and transform everyday life through automation.</p>
                </div>
              </div>
              <div className="col-md-6" data-aos="fade-up" data-aos-delay="200">
                <div className="feature-card">
                  <div className="feature-icon">👁️</div>
                  <h3>Our Vision</h3>
                  <p>To be a global leader in robotic innovation by driving sustainable, user-focused automation 
                  and AI integration across industries.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Showcase Section - EXACT SAME STRUCTURE AS HOME */}
        <section className="showcase-section py-5">
          <div className="container">
            <h2 className="text-center mb-5" data-aos="fade-up">
              Our <span className="highlight">Core Values</span>
            </h2>
            <div className="row g-5 align-items-center">
              <div className="col-md-6" data-aos="zoom-in">
                <div className="showcase-card">
                  <div className="feature-icon">🚀</div>
                  <h4 className="mt-3">Innovation through Technology</h4>
                  <p>Constantly pushing boundaries with cutting-edge technology and creative solutions.</p>
                </div>
              </div>
              <div className="col-md-6" data-aos="zoom-in" data-aos-delay="200">
                <div className="showcase-card">
                  <div className="feature-icon">🤝</div>
                  <h4 className="mt-3">Transparency and Trust</h4>
                  <p>Building strong relationships based on honesty, reliability, and open communication.</p>
                </div>
              </div>
              <div className="col-md-6" data-aos="zoom-in" data-aos-delay="400">
                <div className="showcase-card">
                  <div className="feature-icon">🎯</div>
                  <h4 className="mt-3">User-Centered Design</h4>
                  <p>Creating solutions that truly meet user needs and provide exceptional experiences.</p>
                </div>
              </div>
              <div className="col-md-6" data-aos="zoom-in" data-aos-delay="600">
                <div className="showcase-card">
                  <div className="feature-icon">🌱</div>
                  <h4 className="mt-3">Commitment to Sustainability</h4>
                  <p>Developing eco-friendly solutions that contribute to a better, greener future.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - EXACT SAME AS HOME */}
        <section className="cta-section py-5" data-aos="fade-up">
          <div className="container text-center">
            <h2 className="mb-4">Ready to Work With Us?</h2>
            <p className="cta-description mb-4">
              Join the community of satisfied clients who have transformed their requirements with Robonics solutions.
            </p>
            <div className="cta-buttons">
              <Link to="/book" className="btn btn-lg btn-primary me-3">
                Book 
              </Link>
              <Link to="/pricing" className="btn btn-lg btn-primary me-3">
                View Pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Footer - EXACT SAME AS HOME */}
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

      {/* ========== STYLES - EXACT SAME AS HOME ========== */}
      <style jsx>{`
        /* About Container - EXACT SAME AS HOME */
        .about-container {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(180deg, #0d0d14, #1a1a2e);
          color: #e0e0f0;
          min-height: 100vh;
        }

        /* Navigation - EXACT SAME AS HOME */
        .home-nav {
          background-color: #1a1a2e !important;
          padding: 1rem 0;
        }

        /* Logo only with rounded border - EXACT SAME AS HOME */
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

        /* Regular navigation links - EXACT SAME AS HOME */
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

        /* Auth Buttons Container - EXACT SAME AS HOME */
        .auth-buttons {
          margin-left: 10px;
          display: flex;
          align-items: center;
        }

        /* Login Button - Blue/Purple Outline - EXACT SAME AS HOME */
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

        /* Sign Up Button - Green Gradient - EXACT SAME AS HOME */
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

        /* Hero Section - EXACT SAME AS HOME */
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

        /* Features Section - EXACT SAME AS HOME */
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

        /* Showcase Section - EXACT SAME AS HOME */
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

        /* CTA Section - EXACT SAME AS HOME */
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

        /* Footer - EXACT SAME AS HOME */
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

        /* Responsive Design - EXACT SAME AS HOME */
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

        /* Custom spacing - EXACT SAME AS HOME */
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

        /* Text colors - EXACT SAME AS HOME */
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

export default About;