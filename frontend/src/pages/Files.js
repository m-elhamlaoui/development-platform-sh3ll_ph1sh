import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSun, FaMoon, FaUpload, FaSearch, FaFilter, FaDownload, FaTrash, FaStar, FaShare, FaVideo, FaMusic } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { getFilesBySubject, uploadFile, deleteFile, toggleFavorite, getUserUploads, getUserFavorites, getAllFiles, getFileUrl } from '../api/fileService';
import { getSubjects } from '../api/subjectService';
import { Button, Input, Select, message, Modal, List, Card, Space, Tag, Upload } from 'antd';
import { UploadOutlined, DeleteOutlined, StarOutlined, StarFilled, FileOutlined } from '@ant-design/icons';
import ShareModal from '../components/ShareModal';
import Navbar from '../components/Navbar';
import './styles/Files.css';
import { Modal as AntdModal } from 'antd';

const FILE_TYPES = ['PDF', 'Video', 'Audio', 'Document', 'Other'];

const { Option } = Select;

const SkeletonCard = () => (
  <div className="file-card skeleton">
    <div className="file-icon skeleton-icon"></div>
    <div className="file-title skeleton-title"></div>
    <div className="file-actions skeleton-btn"></div>
  </div>
);

const FilesPage = () => {
  const { user } = useAuth();
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [view, setView] = useState('subject'); // 'subject', 'myuploads', 'favorites'
  const [fileList, setFileList] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    fileType: '',
    file: null
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    loadSubjects();
  }, [navigate]);

  useEffect(() => {
    if (view === 'favorites') {
      loadFavorites();
    } else if (category) {
      loadFiles(category);
    }
  }, [view, category]);

  // If subject changes in URL, update filter
  useEffect(() => {
    if (subjectFromURL) {
      setCategory(subjectFromURL);
      loadFiles(subjectFromURL);
    } else {
      setCategory('All');
      setFiles([]);
    }
  }, [subjectFromURL]);

  // Add effect to load files when category changes
  useEffect(() => {
    if (category && category !== 'All') {
      loadFiles(category);
    }
  }, [category]);

  // Handle navigation to /favorites
  useEffect(() => {
    if (location.pathname === '/favorites') {
      setView('favorites');
    } else {
      setView('subject');
    }
  }, [location.pathname]);

  useEffect(() => {
    document.body.dataset.theme = dark ? 'dark' : 'light';
  }, [dark]);

  const loadSubjects = async () => {
    try {
      const data = await getSubjects();
      setSubjects(data);
    } catch (error) {
      message.error('Error loading subjects');
    }
  };

  const loadFiles = async (subjectName) => {
    setLoading(true);
    try {
      let fileData;
      if (!subjectName || subjectName === 'All') {
        fileData = await getAllFiles();
      } else {
        fileData = await getFilesBySubject(subjectName);
      }
      // Add url property for each file
      fileData = fileData.map(file => ({
        ...file,
        url: getFileUrl(file.stored_file_name)
      }));
      setFiles(fileData);
    } catch (error) {
      console.error('Failed to load files:', error);
      message.error('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    setLoading(true);
    try {
      let data = await getUserFavorites();
      // Add url property for each file
      data = data.map(file => ({
        ...file,
        url: getFileUrl(file.stored_file_name)
      }));
      setFiles(data);
    } catch (error) {
      message.error('Error loading favorites');
    } finally {
      setLoading(false);
    }
  };

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

  const handleFileOpen = async (file) => {
    try {
      const response = await fetch(file.url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to open file');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      window.open(url, '_blank');
    } catch (error) {
      message.error('Error opening file');
    }
  };

  const handleDownload = async (file) => {
    try {
      const response = await fetch(file.url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      message.error('Error downloading file');
    }
  };

  const handleToggleFavorite = async (fileId) => {
    try {
      await toggleFavorite(fileId);
      loadFiles();
    } catch (error) {
      message.error('Error updating favorite status');
    }
  };

  const handleDelete = async (fileId) => {
    try {
      await deleteFile(fileId);
      message.success('File deleted successfully');
      loadFiles();
    } catch (error) {
      message.error('Error deleting file');
    }
  };

  const handleUpload = async () => {
    if (!formData.file || !formData.title || !formData.fileType) {
      message.error('Please fill in all fields');
      return;
    }

    setUploading(true);
    try {
      await uploadFile(formData.file, category, formData.title, formData.fileType);
      message.success('File uploaded successfully');
      setUploadModalVisible(false);
      setFormData({ title: '', fileType: '', file: null });
      setFileList([]);
      loadFiles(category);
    } catch (error) {
      message.error('Error uploading file');
    } finally {
      setUploading(false);
    }
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

  const inputId = "files-search";
  const showReset = category !== 'All';

  const renderFileList = () => {
    return (
      <div className="files-grid">
        {filteredFiles.map(file => {
          const type = file.fileType || file.file_type;
          return (
            <div className="file-card" key={file.id}>
              <div className="file-card-content">
                <div className="file-icon">
                  {type === 'PDF' && <FileOutlined style={{ fontSize: 40, color: '#e74c3c' }} />}
                  {type === 'Image' && <img src={file.url} alt={file.title} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />}
                  {type === 'Video' && <FaVideo style={{ fontSize: 40, color: '#2980b9' }} />}
                  {type === 'Audio' && <FaMusic style={{ fontSize: 40, color: '#16a085' }} />}
                  {type === 'Document' && <FileOutlined style={{ fontSize: 40, color: '#8e44ad' }} />}
                  {type === 'Other' && <FileOutlined style={{ fontSize: 40, color: '#7f8c8d' }} />}
                </div>
                <div className="file-title">{file.title}</div>
                <div className="file-meta-info">
                  <span>Uploaded by: {file.user_name || file.uploader_name || 'Unknown'}</span>
                  <span>Date: {new Date(file.created_at).toLocaleDateString()}</span>
                </div>
                <Button 
                  type="primary" 
                  icon={<FaDownload />}
                  onClick={(e) => { e.stopPropagation(); handleDownload(file); }}
                  style={{ marginTop: 16, width: '100%' }}
                >
                  Download File
                </Button>
                <div className="file-actions">
                  <Button 
                    type="text" 
                    icon={file.is_favorite ? <StarFilled style={{ color: '#faad14' }} /> : <StarOutlined />}
                    onClick={(e) => { e.stopPropagation(); handleToggleFavorite(file.id); }}
                    title={file.is_favorite ? "Remove from favorites" : "Add to favorites"}
                  />
                  <Button 
                    type="text" 
                    icon={<DeleteOutlined style={{ color: '#ff4d4f' }} />}
                    onClick={(e) => { e.stopPropagation(); handleDelete(file.id); }}
                    title="Delete file"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="files-page" style={{ background: 'var(--color-bg)', color: 'var(--color-text)', minHeight: '100vh', paddingTop: '80px' }}>
      <Navbar />

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
              onClick={() => setUploadModalVisible(true)}
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
              : filteredFiles.length > 0 ? (
                  renderFileList()
                ) : (
                  <div className="no-files">
                    <h3>No files found{category !== 'All' ? ' for this subject' : ''}</h3>
                    <button
                      className="upload-btn"
                      onClick={() => setUploadModalVisible(true)}
                    >
                      <FaUpload /> Upload Files
                    </button>
                  </div>
                )
            }
          </div>
        </AnimatePresence>
      </section>

      <Modal
        title={`Upload File to ${category}`}
        open={uploadModalVisible}
        onOk={handleUpload}
        onCancel={() => setUploadModalVisible(false)}
        confirmLoading={uploading}
      >
        <Input
          placeholder="Title"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          style={{ marginBottom: 16 }}
        />
        <Select
          style={{ width: '100%', marginBottom: 16 }}
          placeholder="Select file type"
          value={formData.fileType}
          onChange={value => setFormData({ ...formData, fileType: value })}
        >
          <Option value="PDF">PDF</Option>
          <Option value="Video">Video</Option>
          <Option value="Audio">Audio</Option>
          <Option value="Document">Document</Option>
          <Option value="Other">Other</Option>
        </Select>
        <Upload
          beforeUpload={file => {
            setFormData({ ...formData, file });
            setFileList([file]);
            return false;
          }}
          fileList={fileList}
          onRemove={() => {
            setFormData({ ...formData, file: null });
            setFileList([]);
          }}
        >
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
      </Modal>

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