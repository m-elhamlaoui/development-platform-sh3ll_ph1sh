const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const subjectController = require('../controllers/subjectController');

// Get all subjects
router.get('/', authenticateToken, subjectController.getAllSubjects);

// Create a new subject
router.post('/', authenticateToken, subjectController.createSubject);

// Get a specific subject
router.get('/:id', authenticateToken, subjectController.getSubject);

// Update a subject
router.put('/:id', authenticateToken, subjectController.updateSubject);

// Delete a subject
router.delete('/:id', authenticateToken, subjectController.deleteSubject);

module.exports = router; 