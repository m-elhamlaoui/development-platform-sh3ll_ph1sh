const pool = require('../config/db');
const path = require('path');
const fs = require('fs').promises;

const fileController = {
  // Get files by subject
  async getFilesBySubject(req, res) {
    try {
      const { subject } = req.query;
      
      // Add this console log to see the received subject
      console.log('Received subject for filtering:', subject);

      if (!subject) {
        return res.status(400).json({ message: 'Subject parameter is required' });
      }

      const result = await pool.query(
        `SELECT f.*, 
          CASE WHEN fav.id IS NOT NULL THEN true ELSE false END as is_favorite
        FROM files f
        LEFT JOIN favorites fav ON f.id = fav.file_id AND fav.user_id = $1
        WHERE f.subject = $2
        ORDER BY f.created_at DESC`,
        [req.user.id, subject]
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Error getting files:', error);
      res.status(500).json({ message: 'Error retrieving files' });
    }
  },

  // Get user's uploaded files
  async getUserUploads(req, res) {
    try {
      const result = await pool.query(
        `SELECT f.*, 
          CASE WHEN fav.id IS NOT NULL THEN true ELSE false END as is_favorite
        FROM files f
        LEFT JOIN favorites fav ON f.id = fav.file_id AND fav.user_id = $1
        WHERE f.user_id = $1
        ORDER BY f.created_at DESC`,
        [req.user.id]
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Error getting user uploads:', error);
      res.status(500).json({ message: 'Error retrieving user uploads' });
    }
  },

  // Get user's favorite files
  async getUserFavorites(req, res) {
    try {
      const result = await pool.query(
        `SELECT f.*, true as is_favorite
        FROM files f
        INNER JOIN favorites fav ON f.id = fav.file_id
        WHERE fav.user_id = $1
        ORDER BY fav.created_at DESC`,
        [req.user.id]
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Error getting favorites:', error);
      res.status(500).json({ message: 'Error retrieving favorites' });
    }
  },

  // Upload a file
  async uploadFile(req, res) {
    try {
      console.log('Upload request received:', {
        file: req.file,
        body: req.body,
        user: req.user
      });

      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }

      const { subject, title, fileType } = req.body;

      if (!subject || !title || !fileType) {
        // Delete the uploaded file if validation fails
        if (req.file.path) {
          try {
            await fs.unlink(req.file.path);
          } catch (unlinkError) {
            console.error('Error deleting file after validation failure:', unlinkError);
          }
        }
        return res.status(400).json({ 
          message: 'Missing required fields',
          details: {
            subject: !subject ? 'Subject is required' : null,
            title: !title ? 'Title is required' : null,
            fileType: !fileType ? 'File type is required' : null
          }
        });
      }

      const result = await pool.query(
        'INSERT INTO files (user_id, subject, title, file_type, file_name, stored_file_name) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [req.user.id, subject, title, fileType, req.file.originalname, req.file.filename]
      );

      console.log('File uploaded successfully:', {
        fileId: result.rows[0].id,
        fileName: req.file.originalname
      });

      res.status(201).json({ 
        message: 'File uploaded successfully',
        fileId: result.rows[0].id 
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      
      // Delete the uploaded file if database operation fails
      if (req.file && req.file.path) {
        try {
          await fs.unlink(req.file.path);
        } catch (unlinkError) {
          console.error('Error deleting file after failed upload:', unlinkError);
        }
      }

      res.status(500).json({ message: 'Error uploading file' });
    }
  },

  // Get a specific file
  async getFile(req, res) {
    try {
      const { filename } = req.params;
      
      const result = await pool.query(
        `SELECT f.*, 
          CASE WHEN fav.id IS NOT NULL THEN true ELSE false END as is_favorite
        FROM files f
        LEFT JOIN favorites fav ON f.id = fav.file_id AND fav.user_id = $1
        WHERE f.stored_file_name = $2`,
        [req.user.id, filename]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'File not found' });
      }

      const file = result.rows[0];
      const filePath = path.join(__dirname, '../../uploads', filename);
      
      try {
        await fs.access(filePath);
      } catch {
        return res.status(404).json({ message: 'File not found on server' });
      }

      res.download(filePath, file.file_name);
    } catch (error) {
      console.error('Error getting file:', error);
      res.status(500).json({ message: 'Error retrieving file' });
    }
  },

  // Delete a file
  async deleteFile(req, res) {
    try {
      const { fileId } = req.params;

      const result = await pool.query(
        'SELECT * FROM files WHERE id = $1',
        [fileId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'File not found' });
      }

      const file = result.rows[0];

      // Only allow deletion by the file owner or an admin
      if (file.user_id !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this file' });
      }

      const filePath = path.join(__dirname, '../../uploads', file.stored_file_name);
      
      // Delete file from storage
      try {
        await fs.unlink(filePath);
      } catch (unlinkError) {
        console.error('Error deleting file from storage:', unlinkError);
      }
      
      // Delete from database
      await pool.query('DELETE FROM files WHERE id = $1', [fileId]);

      res.json({ message: 'File deleted successfully' });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({ message: 'Error deleting file' });
    }
  },

  // Toggle favorite status
  async toggleFavorite(req, res) {
    try {
      const { fileId } = req.params;
      const userId = req.user.id;

      // Check if file exists
      const fileResult = await pool.query(
        'SELECT id FROM files WHERE id = $1',
        [fileId]
      );

      if (fileResult.rows.length === 0) {
        return res.status(404).json({ message: 'File not found' });
      }

      // Check if favorite already exists
      const favoriteResult = await pool.query(
        'SELECT id FROM favorites WHERE file_id = $1 AND user_id = $2',
        [fileId, userId]
      );

      if (favoriteResult.rows.length > 0) {
        // Remove favorite
        await pool.query(
          'DELETE FROM favorites WHERE file_id = $1 AND user_id = $2',
          [fileId, userId]
        );
        res.json({ message: 'File removed from favorites' });
      } else {
        // Add favorite
        await pool.query(
          'INSERT INTO favorites (file_id, user_id) VALUES ($1, $2)',
          [fileId, userId]
        );
        res.json({ message: 'File added to favorites' });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      res.status(500).json({ message: 'Error updating favorite status' });
    }
  },

  // Get all files
  async getAllFiles(req, res) {
    try {
      const result = await pool.query(
        `SELECT f.*, 
          CASE WHEN fav.id IS NOT NULL THEN true ELSE false END as is_favorite
        FROM files f
        LEFT JOIN favorites fav ON f.id = fav.file_id AND fav.user_id = $1
        ORDER BY f.created_at DESC`,
        [req.user.id]
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error getting all files:', error);
      res.status(500).json({ message: 'Error retrieving all files' });
    }
  }
};

module.exports = fileController; 