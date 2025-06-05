import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '../components/Navbar';
import './styles/Subjects.css';
import { getSubjects } from '../api/subjectService';

const SUBJECT_LEVELS = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const SUBJECT_COLORS = [
  '#4CAF50', '#2196F3', '#FF9800', '#9C27B0', '#607D8B', '#FF5722', '#795548', '#009688', '#E91E63', '#3F51B5', '#00BCD4', '#8BC34A', '#FFC107', '#FFEB3B', '#CDDC39', '#673AB7', '#F44336', '#00E676', '#FFB300', '#B71C1C'
];

const SUBJECT_ICONS = {
  Mathematics: '📐',
  Physics: '🔬',
  Chemistry: '⚗️',
  Biology: '🧬',
  English: '📚',
  History: '🏺',
  Geography: '🌍',
  'Computer Science': '💻',
  French: '🗼',
  Arabic: '🕌',
  // Add more as needed
};

const SkeletonCard = () => (
  <div className="subject-card skeleton">
    <div className="subject-icon skeleton-icon"></div>
    <div className="subject-title skeleton-title"></div>
    <div className="subject-actions skeleton-btn"></div>
  </div>
);

const SubjectsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [level, setLevel] = useState('All');
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    // Fetch subjects from backend
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const data = await getSubjects();
        // Assign a random color to each subject
        const coloredSubjects = data.map(subject => ({
          ...subject,
          color: SUBJECT_COLORS[Math.floor(Math.random() * SUBJECT_COLORS.length)]
        }));
        setSubjects(coloredSubjects);
      } catch (error) {
        setSubjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  // Filter logic
  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (level === 'All' || subject.level === level)
  );

  // Accessibility: search input id
  const inputId = "subjects-search";

  const handleSubjectClick = (subject) => {
    navigate('/files', { state: { subject } });
  };

  return (
    <div className="subjects-page" style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh', paddingTop: '80px' }}>
      <Navbar />
      {/* Hero / welcome */}
      <section className="subjects-hero glassy">
        <div className="hero-content">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="subjects-main-title"
          >
            Welcome to <span className="hero-appname">eduINPT</span>!
          </motion.h2>
          <p className="hero-desc">
            Find, explore and learn with top-notch resources.<br />
            Filter by subject or skill level, and enjoy a personalized learning experience.
          </p>
        </div>
        <motion.img
          src="https://raw.githubusercontent.com/abdelouahab99/edu-assets/main/lottie-learning.gif"
          alt=""
          className="hero-illustration"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.9, type: 'spring' }}
          draggable={false}
        />
      </section>

      {/* Search & filter */}
      <section className="subjects-title-section glassy">
        <label htmlFor={inputId} className="sr-only">Search subjects</label>
        <div className="subjects-search-container">
          <svg 
            className="subjects-search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            type="text"
            id={inputId}
            placeholder="Search for subjects..."
            className="subjects-search-input"
            value={searchQuery}
            autoComplete="off"
            aria-label="Search for subjects"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Filter */}
        <div className="subjects-filters" role="radiogroup" aria-label="Filter by level">
          {SUBJECT_LEVELS.map(lvl => (
            <button
              key={lvl}
              className={`subjects-filter-btn${level === lvl ? ' active' : ''}`}
              onClick={() => setLevel(lvl)}
              aria-pressed={level === lvl}
            >
              {lvl}
            </button>
          ))}
        </div>
      </section>

      {/* Subjects grid */}
      <section className="subjects-grid">
        <AnimatePresence>
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            : filteredSubjects.length > 0 ? (
                filteredSubjects.map(subject => (
                  <motion.div
                    key={subject.id}
                    className="subject-card"
                    style={{ borderTop: `4px solid ${subject.color}` }}
                    tabIndex={0}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 30 }}
                    whileHover={{ scale: 1.04, boxShadow: `0 6px 24px ${subject.color}44` }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSubjectClick(subject)}
                    onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleSubjectClick(subject)}
                    role="button"
                    aria-label={`Open subject: ${subject.name}`}
                  >
                    <div className="subject-icon" style={{ color: subject.color }}>
                      {SUBJECT_ICONS[subject.name] || '📘'}
                    </div>
                    <h3 className="subject-title">{subject.name}</h3>
                    <div className="subject-level">{subject.level}</div>
                    <div className="subject-actions">
                      <button
                        className="open-subject-btn"
                        style={{ backgroundColor: subject.color, color: 'white' }}
                        tabIndex={-1}
                        aria-label={`Open ${subject.name}`}
                        onClick={e => {
                          e.stopPropagation();
                          handleSubjectClick(subject);
                        }}
                      >
                        Open
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  key="no-results"
                  className="no-results"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  No subjects match your search criteria.
                </motion.div>
              )}
        </AnimatePresence>
      </section>

      {/* Footer */}
      <footer className="subjects-footer glassy">
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
        <div className="footer-note">
          Designed with passion for learners worldwide.
        </div>
      </footer>
    </div>
  );
};

export default SubjectsPage; 