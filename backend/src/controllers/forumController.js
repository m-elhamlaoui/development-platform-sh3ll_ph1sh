const pool = require('../config/db');

const forumController = {

  // Get questions by subject
  async getQuestionsBySubject(req, res) {
    try {
      const { subjectId } = req.params;

      const result = await pool.query(
        'SELECT q.*, u.email as author_email FROM questions q JOIN users u ON q.user_id = u.id WHERE q.subject_id = $1 ORDER BY q.created_at DESC',
        [subjectId]
      );

      res.json(result.rows);
    } catch (error) {
      console.error('Error getting questions by subject:', error);
      res.status(500).json({ message: 'Error retrieving questions' });
    }
  },

  // Get a single question and its answers
  async getQuestionWithAnswers(req, res) {
    try {
      const { questionId } = req.params;

      const questionResult = await pool.query(
        'SELECT q.*, u.email as author_email FROM questions q JOIN users u ON q.user_id = u.id WHERE q.id = $1',
        [questionId]
      );

      if (questionResult.rows.length === 0) {
        return res.status(404).json({ message: 'Question not found' });
      }

      const answersResult = await pool.query(
        'SELECT a.*, u.email as author_email FROM answers a JOIN users u ON a.user_id = u.id WHERE a.question_id = $1 ORDER BY a.created_at ASC',
        [questionId]
      );

      const question = questionResult.rows[0];
      const answers = answersResult.rows;

      res.json({ question, answers });
    } catch (error) {
      console.error('Error getting question with answers:', error);
      res.status(500).json({ message: 'Error retrieving question and answers' });
    }
  },

  // Create a new question
  async createQuestion(req, res) {
    try {
      const { subjectId, title, content } = req.body;
      const userId = req.user.id; // From authenticateToken middleware

      if (!subjectId || !title || !content) {
        return res.status(400).json({ message: 'Missing required fields: subjectId, title, content' });
      }

      const result = await pool.query(
        'INSERT INTO questions (user_id, subject_id, title, content) VALUES ($1, $2, $3, $4) RETURNING id, created_at',
        [userId, subjectId, title, content]
      );

      res.status(201).json({ 
        message: 'Question created successfully',
        questionId: result.rows[0].id,
        createdAt: result.rows[0].created_at
      });
    } catch (error) {
      console.error('Error creating question:', error);
      res.status(500).json({ message: 'Error creating question' });
    }
  },

  // Create a new answer
  async createAnswer(req, res) {
    try {
      const { questionId } = req.params;
      const { content } = req.body;
      const userId = req.user.id; // From authenticateToken middleware

      if (!content) {
        return res.status(400).json({ message: 'Answer content is required' });
      }

      const result = await pool.query(
        'INSERT INTO answers (question_id, user_id, content) VALUES ($1, $2, $3) RETURNING id, created_at',
        [questionId, userId, content]
      );

      res.status(201).json({ 
        message: 'Answer created successfully',
        answerId: result.rows[0].id,
        createdAt: result.rows[0].created_at
      });
    } catch (error) {
      console.error('Error creating answer:', error);
      res.status(500).json({ message: 'Error creating answer' });
    }
  },

  // Delete a question
  async deleteQuestion(req, res) {
    try {
      const { questionId } = req.params;
      const userId = req.user.id;

      // Check if the question exists and get its author
      const questionResult = await pool.query(
        'SELECT user_id FROM questions WHERE id = $1',
        [questionId]
      );

      if (questionResult.rows.length === 0) {
        return res.status(404).json({ message: 'Question not found' });
      }

      const question = questionResult.rows[0];

      // Check if the user is the author or an admin
      if (question.user_id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this question' });
      }

      // Delete the question
      await pool.query('DELETE FROM questions WHERE id = $1', [questionId]);

      res.json({ message: 'Question deleted successfully' });

    } catch (error) {
      console.error('Error deleting question:', error);
      res.status(500).json({ message: 'Error deleting question' });
    }
  },

  // Delete an answer
  async deleteAnswer(req, res) {
    try {
      const { answerId } = req.params;
      const userId = req.user.id;

      // Check if the answer exists and get its author
      const answerResult = await pool.query(
        'SELECT user_id FROM answers WHERE id = $1',
        [answerId]
      );

      if (answerResult.rows.length === 0) {
        return res.status(404).json({ message: 'Answer not found' });
      }

      const answer = answerResult.rows[0];

      // Check if the user is the author or an admin
      if (answer.user_id !== userId && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to delete this answer' });
      }

      // Delete the answer
      await pool.query('DELETE FROM answers WHERE id = $1', [answerId]);

      res.json({ message: 'Answer deleted successfully' });

    } catch (error) {
      console.error('Error deleting answer:', error);
      res.status(500).json({ message: 'Error deleting answer' });
    }
  }

};

module.exports = forumController; 