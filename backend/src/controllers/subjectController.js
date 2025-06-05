const pool = require('../config/db');

const subjectController = {
  // Get all subjects
  async getAllSubjects(req, res) {
    try {
      const result = await pool.query(
        'SELECT * FROM subjects ORDER BY name ASC'
      );
      res.json(result.rows);
    } catch (error) {
      console.error('Error getting subjects:', error);
      res.status(500).json({ message: 'Error retrieving subjects' });
    }
  },

  // Get a specific subject
  async getSubject(req, res) {
    try {
      const { id } = req.params;
      const result = await pool.query(
        'SELECT * FROM subjects WHERE id = $1',
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error getting subject:', error);
      res.status(500).json({ message: 'Error retrieving subject' });
    }
  },

  // Create a new subject
  async createSubject(req, res) {
    try {
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Subject name is required' });
      }

      const result = await pool.query(
        'INSERT INTO subjects (name, description) VALUES ($1, $2) RETURNING *',
        [name, description]
      );

      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Error creating subject:', error);
      res.status(500).json({ message: 'Error creating subject' });
    }
  },

  // Update a subject
  async updateSubject(req, res) {
    try {
      const { id } = req.params;
      const { name, description } = req.body;

      if (!name) {
        return res.status(400).json({ message: 'Subject name is required' });
      }

      const result = await pool.query(
        'UPDATE subjects SET name = $1, description = $2 WHERE id = $3 RETURNING *',
        [name, description, id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error updating subject:', error);
      res.status(500).json({ message: 'Error updating subject' });
    }
  },

  // Delete a subject
  async deleteSubject(req, res) {
    try {
      const { id } = req.params;

      // Check if subject exists
      const checkResult = await pool.query(
        'SELECT * FROM subjects WHERE id = $1',
        [id]
      );

      if (checkResult.rows.length === 0) {
        return res.status(404).json({ message: 'Subject not found' });
      }

      // Delete subject
      await pool.query('DELETE FROM subjects WHERE id = $1', [id]);

      res.json({ message: 'Subject deleted successfully' });
    } catch (error) {
      console.error('Error deleting subject:', error);
      res.status(500).json({ message: 'Error deleting subject' });
    }
  }
};

module.exports = subjectController; 