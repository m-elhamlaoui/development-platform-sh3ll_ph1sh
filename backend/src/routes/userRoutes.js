const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const userController = require('../controllers/userController');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/profile', authenticateToken, userController.getProfile);

module.exports = router; 