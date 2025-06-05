import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import './styles/Landing.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <header className="landing-header glassy">
        <div className="landing-header-left">
          <div className="landing-logo">EI</div>
          <h1 className="landing-app-name">eduINPT</h1>
        </div>
        <div className="landing-header-right">
          <button
            className="auth-btn signin-btn"
            onClick={() => navigate('/signin')}
          >
            Sign In
          </button>
          <button
            className="auth-btn signup-btn"
            onClick={() => navigate('/signup')}
          >
            Sign Up
          </button>
        </div>
      </header>

      <main className="landing-main">
        <section className="hero-section glassy">
          <div className="hero-content">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="hero-title"
            >
              Your Digital Learning
              <span className="hero-highlight"> Platform</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="hero-subtitle"
            >
              Access study materials, share resources, and collaborate with peers
              all in one place.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="hero-cta"
            >
              <button
                className="cta-button primary"
                onClick={() => navigate('/signup')}
              >
                Get Started
              </button>
              <button
                className="cta-button secondary"
                onClick={() => navigate('/about')}
              >
                Learn More
              </button>
            </motion.div>
          </div>
          <motion.img
            src="https://raw.githubusercontent.com/abdelouahab99/edu-assets/main/lottie-files.gif"
            alt="Education illustration"
            className="hero-illustration"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.9, type: 'spring' }}
          />
        </section>

        <section className="features-section glassy">
          <h2 className="features-title">Why Choose eduINPT?</h2>
          <div className="features-grid">
            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">📚</div>
              <h3>Organized Resources</h3>
              <p>Access all your study materials in one organized place</p>
            </motion.div>
            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">🤝</div>
              <h3>Collaboration</h3>
              <p>Share and collaborate with your peers easily</p>
            </motion.div>
            <motion.div
              className="feature-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon">🔒</div>
              <h3>Secure Access</h3>
              <p>Your data is always protected and secure</p>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="landing-footer glassy">
        <div className="footer-content">
          <div className="footer-left">
            &copy; {new Date().getFullYear()} eduINPT. All rights reserved.
          </div>
          <div className="footer-right">
            <a href="#privacy" className="footer-link">Privacy Policy</a>
            <span className="footer-sep">|</span>
            <a href="#terms" className="footer-link">Terms of Service</a>
            <span className="footer-sep">|</span>
            <a href="#contact" className="footer-link">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 