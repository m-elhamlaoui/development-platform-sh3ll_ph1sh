const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { authenticateToken } = require('../middleware/auth');

// Get questions by subject
router.get('/subject/:subjectId', authenticateToken, forumController.getQuestionsBySubject);

// Get a single question and its answers
router.get('/question/:questionId', authenticateToken, forumController.getQuestionWithAnswers);

// Create a new question
router.post('/question', authenticateToken, forumController.createQuestion);

// Create a new answer
router.post('/question/:questionId/answer', authenticateToken, forumController.createAnswer);

// Delete a question
router.delete('/question/:questionId', authenticateToken, forumController.deleteQuestion);

// Delete an answer
router.delete('/answer/:answerId', authenticateToken, forumController.deleteAnswer);

module.exports = router; 