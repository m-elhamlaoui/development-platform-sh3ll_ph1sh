import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Subjects.css';

const SubjectsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  
  const subjects = [
    { id: 1, name: 'Mathematics', color: '#4CAF50' },
    { id: 2, name: 'Physics', color: '#2196F3' },
    { id: 3, name: 'English', color: '#FF9800' },
    { id: 4, name: 'French', color: '#9C27B0' },
    { id: 5, name: 'Arabic', color: '#607D8B' },
    { id: 6, name: 'Chemistry', color: '#FF5722' },
    { id: 7, name: 'History', color: '#795548' },
    { id: 8, name: 'Computer Science', color: '#009688' }
  ];

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubjectClick = (subject) => {
    navigate('/files', { state: { subject } });
  };

  const SearchIcon = () => (
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
  );

  return (
    <div className="subjects-page">
      {/* Header section */}
      <div className="subjects-header">
        <div className="subjects-header-left">
          <div className="subjects-logo">EI</div>
          <h1 className="subjects-app-name">eduINPT</h1>
        </div>
        <div className="subjects-header-right">
          <a href="#home" className="subjects-nav-link">Home</a>
          <a href="#favorites" className="subjects-nav-link">Favorites</a>
          <a href="#profile" className="subjects-nav-link">Profile</a>
        </div>
      </div>

      {/* Title and search section */}
      <div className="subjects-title-section">
        <h1 className="subjects-main-title">Subjects</h1>
        <div className="subjects-search-container">
          <SearchIcon />
          <input 
            type="text"
            placeholder="Search for subjects..." 
            className="subjects-search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Subjects grid */}
      <div className="subjects-grid">
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map(subject => (
            <div 
              key={subject.id} 
              className="subject-card" 
              style={{ borderTop: `4px solid ${subject.color}` }}
              onClick={() => handleSubjectClick(subject)}
            >
              <div className="subject-icon" style={{ color: subject.color }}>
                📁
              </div>
              <h3 className="subject-title">{subject.name}</h3>
              <div className="subject-actions">
                <button 
                  className="open-subject-btn" 
                  style={{ backgroundColor: subject.color, color: 'white' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubjectClick(subject);
                  }}
                >
                  Open
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">
            No subjects match your search criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsPage;