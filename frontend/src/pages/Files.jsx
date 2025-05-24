import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon, FaUpload } from 'react-icons/fa';
import fileService from '../api/fileService';
import './styles/Files.css';

const FILE_TYPES = ['PDF', 'Video', 'Audio', 'Document', 'Other'];

const SkeletonCard = () => (
  <div className="file-card skeleton">
    <div className="file-icon skeleton-icon"></div>
    <div className="file-title skeleton-title"></div>
    <div className="file-actions skeleton-btn"></div>
  </div>
);

const FilesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const subjectFromURL = params.get('subject');
  const fileInputRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState(subjectFromURL || 'All');
  const [fileType, setFileType] = useState('All');
  const [loading, setLoading] = useState(true);
  const [dark, setDark] = useState(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [files, setFiles] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadData, setUploadData] = useState({
    file: null,
    title: '',
    fileType: 'PDF',
  });

  // Load subjects and files
  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const subjectData = await fileService.getAllSubjects();
        setSubjects(subjectData);
      } catch (error) {
        console.error('Failed to load subjects:', error);
      }
    };

    loadSubjects();
  }, []);

  // If subject changes in URL, update filter
  useEffect(() => {
    if (subjectFromURL) {
      setCategory(subjectFromURL);
      loadFiles(subjectFromURL);
    } else {
      setCategory('All');
    }
  }, [subjectFromURL]);

  const loadFiles = async (subjectName) => {
    if (!subjectName || subjectName === 'All') {
      setFiles([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const fileData = await fileService.getFilesBySubject(subjectName);
      setFiles(fileData);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  const filteredFiles = files.filter(file => {
    const matchesSearch =
      file.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFileType =
      fileType === 'All' || file.fileType === fileType;
    return matchesSearch && matchesFileType;
  });

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case 'PDF': return '📄';
      case 'Video': return '🎥';
      case 'Audio': return '🎧';
      case 'Document': return '📝';
      default: return '📁';
    }
  };

  const handleFileOpen = (file) => {
    const fileUrl = fileService.getFileUrl(file.storedFileName);
    window.open(fileUrl, '_blank');
  };

  const handleDownload = (file, e) => {
    e.stopPropagation();
    const fileUrl = fileService.getFileUrl(file.storedFileName);
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = file.fileName || `${file.title}.file`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleFavorite = (fileId, e) => {
    e.stopPropagation();
    // Add favorite functionality here
    console.log('Toggling favorite for file:', fileId);
  };

  const handleCategoryChange = (newCategory) => {
    if (newCategory === category) return;
    
    // Update URL and navigate
    const params = new URLSearchParams(location.search);
    
    if (newCategory === 'All') {
      params.delete('subject');
      navigate({ pathname: location.pathname, search: params.toString() });
    } else {
      params.set('subject', newCategory);
      navigate({ pathname: location.pathname, search: params.toString() });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.');
      setUploadData({
        ...uploadData,
        file: file,
        title: fileNameWithoutExt || file.name,
      });
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    
    if (!uploadData.file || !category || category === 'All') {
      alert('Please select a file and subject');
      return;
    }
    
    try {
      await fileService.uploadFile(
        uploadData.file,
        category,
        uploadData.title,
        uploadData.fileType
      );
      
      setShowUploadModal(false);
      loadFiles(category);
      setUploadData({ file: null, title: '', fileType: 'PDF' });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to upload file. Please try again.');
    }
  };

  const inputId = "files-search";
  const showReset = category !== 'All';

  return (
    <div className="files-page">
      <header className="files-header glassy">
        <div className="files-header-left">
          <div className="files-logo">EI</div>
          <h1 className="files-app-name">eduINPT</h1>
        </div>
        <div className="files-header-right">
          <nav>
            <a href="/" className="files-nav-link">Home</a>
            <a href="#favorites" className="files-nav-link">Favorites</a>
            <a href="#profile" className="files-nav-link">Profile</a>
          </nav>
          <button
            className="theme-toggle-btn"
            onClick={() => setDark(v => !v)}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            tabIndex={0}
          >
            {dark ? <FaSun /> : <FaMoon />}
          </button>
        </div>
      </header>

      <section className="files-hero glassy">
        <div className="hero-content">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="files-main-title"
          >
            {category !== 'All' ? (
              <>
                {category} <span className="hero-appname">Files</span>
              </>
            ) : (
              <>
                Your Study Files at <span className="hero-appname">eduINPT</span>
              </>
            )}
          </motion.h2>
          <p className="hero-desc">
            Browse, download, and organize your study resources.<br />
            Filter by category or file type to find what you need.
          </p>
          
          {category !== 'All' && (
            <button 
              className="upload-btn"
              onClick={() => setShowUploadModal(true)}
            >
              <FaUpload /> Upload New File
            </button>
          )}
        </div>
        <motion.img
          src="https://raw.githubusercontent.com/abdelouahab99/edu-assets/main/lottie-files.gif"
          alt=""
          className="hero-illustration"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.9, type: 'spring' }}
          draggable={false}
        />
      </section>

      <section className="files-title-section glassy">
        <label htmlFor={inputId} className="sr-only">Search files</label>
        <div className="files-search-container">
          <svg
            className="files-search-icon"
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
            placeholder={`Search for files${category !== 'All' ? ` in ${category}` : ''}...`}
            className="files-search-input"
            value={searchQuery}
            autoComplete="off"
            aria-label="Search for files"
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="files-filters" role="group" aria-label="Filter by category and file type">
          <span className="filter-label">Category:</span>
          {['All', ...subjects.map(s => s.name)].map(cat => (
            <button
              key={cat}
              className={`files-filter-btn${category === cat ? ' active' : ''}`}
              onClick={() => handleCategoryChange(cat)}
              aria-pressed={category === cat}
            >
              {cat}
            </button>
          ))}
          
          <span className="filter-label">Type:</span>
          {['All', ...FILE_TYPES].map(type => (
            <button
              key={type}
              className={`files-filter-btn${fileType === type ? ' active' : ''}`}
              onClick={() => setFileType(type)}
              aria-pressed={fileType === type}
            >
              {type}
            </button>
          ))}
        </div>
      </section>

      <section className="files-grid-section">
        <AnimatePresence>
          <div className="files-grid">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
              : category === 'All' ? (
                  <div className="no-subject-selected">
                    <h3>Please select a subject to view files</h3>
                  </div>
                )
              : filteredFiles.length > 0 ? (
                  filteredFiles.map(file => (
                    <motion.div
                      key={`${file.id}`}
                      className="file-card"
                      tabIndex={0}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 30 }}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleFileOpen(file)}
                      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleFileOpen(file)}
                    >
                      <div className="file-icon">
                        {getFileIcon(file.fileType)}
                      </div>
                      <div className="file-info">
                        <h3 className="file-title">{file.title}</h3>
                        <div className="file-meta">
                          <span className="file-type">{file.fileType}</span>
                          <span className="file-size">{file.size}</span>
                        </div>
                      </div>
                      <div className="file-actions">
                        <button
                          className="file-action-btn download"
                          onClick={(e) => handleDownload(file, e)}
                          aria-label={`Download ${file.title}`}
                        >
                          ⬇️
                        </button>
                        <button
                          className="file-action-btn favorite"
                          onClick={(e) => handleFavorite(file.id, e)}
                          aria-label={`Favorite ${file.title}`}
                        >
                          ⭐
                        </button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="no-files">
                    <h3>No files found for this subject</h3>
                    <button
                      className="upload-btn"
                      onClick={() => setShowUploadModal(true)}
                    >
                      <FaUpload /> Upload Files
                    </button>
                  </div>
                )
            }
          </div>
        </AnimatePresence>
      </section>

      {showUploadModal && (
        <div className="modal-overlay">
          <div className="upload-modal">
            <h2>Upload File to {category}</h2>
            <form onSubmit={handleUploadSubmit}>
              <div className="form-group">
                <label htmlFor="file">Select File</label>
                <input
                  type="file"
                  id="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  value={uploadData.title}
                  onChange={(e) => setUploadData({ ...uploadData, title: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="fileType">File Type</label>
                <select
                  id="fileType"
                  value={uploadData.fileType}
                  onChange={(e) => setUploadData({ ...uploadData, fileType: e.target.value })}
                >
                  {FILE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="files-footer glassy">
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

export default FilesPage;
