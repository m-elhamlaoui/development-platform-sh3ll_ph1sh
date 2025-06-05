const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fileController = require('../controllers/fileController');
const { authenticateToken } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Specific routes first
router.get('/subject', authenticateToken, fileController.getFilesBySubject);
router.get('/myuploads', authenticateToken, fileController.getUserUploads);
router.get('/favorites', authenticateToken, fileController.getUserFavorites);
router.post('/upload', authenticateToken, upload.single('file'), fileController.uploadFile);
router.get('/all', authenticateToken, fileController.getAllFiles);

// Parameterized routes last
router.get('/:filename', authenticateToken, fileController.getFile);
router.delete('/:fileId', authenticateToken, fileController.deleteFile);
router.post('/:fileId/favorite', authenticateToken, fileController.toggleFavorite);

module.exports = router; 