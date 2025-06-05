const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const userController = {
  // Register a new user
  async register(req, res) {
    const { email, password, firstName, lastName } = req.body;

    try {
      // Check if user already exists (case-insensitive)
      const userExists = await pool.query(
        'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
        [email]
      );

      if (userExists.rows.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create user
      const result = await pool.query(
        'INSERT INTO users (email, password, first_name, last_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, first_name, last_name, role',
        [email.toLowerCase(), hashedPassword, firstName, lastName, 'student']
      );

      // Generate JWT
      const token = jwt.sign(
        { userId: result.rows[0].id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: result.rows[0].id,
          email: result.rows[0].email,
          firstName: result.rows[0].first_name,
          lastName: result.rows[0].last_name,
          role: result.rows[0].role
        },
        token
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Error registering user' });
    }
  },

  // Login user
  async login(req, res) {
    const { email, password } = req.body;

    try {
      // Find user with case-insensitive email
      const result = await pool.query(
        'SELECT * FROM users WHERE LOWER(email) = LOWER($1)',
        [email]
      );

      if (result.rows.length === 0) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const user = result.rows[0];

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Update last login
      await pool.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      // Generate JWT
      const token = jwt.sign(
        { userId: user.id },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role
        },
        token
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Error logging in' });
    }
  },

  // Get user profile
  async getProfile(req, res) {
    try {
      const result = await pool.query(
        'SELECT id, email, first_name, last_name, role FROM users WHERE id = $1',
        [req.user.id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = result.rows[0];
      res.json({
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role
      });
    } catch (error) {
      console.error('Get profile error:', error);
      res.status(500).json({ message: 'Error fetching profile' });
    }
  }
};

module.exports = userController; 