import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { message } from 'antd';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import { getSubjects } from '../api/subjectService'; // Assuming getSubjects is here or similar
import './styles/ForumHome.css';

const ForumHome = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadSubjects();
  }, []);

  const loadSubjects = async () => {
    setLoading(true);
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      message.error('Error loading subjects');
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectClick = (subjectId) => {
    navigate(`/forum/subject/${subjectId}`);
  };

  return (
    <div className="forum-home-page" style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh', paddingTop: '80px' }}>
      <Navbar />
      <Breadcrumb /> {/* Add Breadcrumb */}

      <section className="forum-hero glassy">
        <div className="hero-content">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="forum-main-title"
          >
            Welcome to the <span className="hero-appname">Forum</span>
          </motion.h2>
          <p className="hero-desc">
            Find and discuss topics related to your subjects.
          </p>
        </div>
        {/* Add a relevant illustration */}
        <motion.img
          src="https://raw.githubusercontent.com/abdelouahab99/edu-assets/main/lottie-forum.gif"
          alt="Forum Illustration"
          className="hero-illustration"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.9, type: 'spring' }}
          draggable={false}
        />
      </section>

      <section className="forum-subjects-list">
        {loading ? (
          // Add skeleton loading for subjects if needed
          <div>Loading subjects...</div>
        ) : subjects.length > 0 ? (
          <div className="subjects-grid">
            {subjects.map(subject => (
              <motion.div
                key={subject.id}
                className="subject-card"
                onClick={() => handleSubjectClick(subject.id)}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <h3>{subject.name}</h3>
                <p>Discuss topics in {subject.name}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="no-subjects">
            <p>No subjects available for forum discussions.</p>
          </div>
        )}
      </section>

      {/* Add a basic footer */}
      <footer className="forum-footer glassy">
        <div className="footer-content">
          <div className="footer-left">
            &copy; {new Date().getFullYear()} eduINPT. All rights reserved.
          </div>
          <div className="footer-right">
            <a href="#legal" className="footer-link">Legal Notice</a>
            <span className="footer-sep">|</span>
            <a href="#contact" className="footer-link">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default ForumHome; 