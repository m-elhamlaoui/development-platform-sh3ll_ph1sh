const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

async function initializeDatabase() {
  // First, connect to the default postgres database to create our database
  const defaultPool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'postgres',
    password: process.env.DB_PASSWORD || '1234',
    port: process.env.DB_PORT || 5432,
  });

  try {
    // Create database if it doesn't exist
    await defaultPool.query(`
      SELECT 'CREATE DATABASE eduinpt_db'
      WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'eduinpt_db')
    `);
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await defaultPool.end();
  }

  // Now connect to our database to create tables
  const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: 'eduinpt_db',
    password: process.env.DB_PASSWORD || '1234',
    port: process.env.DB_PORT || 5432,
  });

  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'student',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS subjects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) UNIQUE NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS files (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        subject VARCHAR(100) NOT NULL,
        title VARCHAR(255) NOT NULL,
        file_type VARCHAR(50) NOT NULL,
        file_name VARCHAR(255) NOT NULL,
        stored_file_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS favorites (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(user_id, file_id)
      );
    `);

    // Insert initial subjects
    await pool.query(`
      INSERT INTO subjects (name, description) VALUES
        ('Mathematics', 'Advanced mathematics courses including calculus, algebra, and statistics'),
        ('Physics', 'Classical and modern physics concepts and applications'),
        ('Computer Science', 'Programming, algorithms, and computer systems'),
        ('Chemistry', 'Organic and inorganic chemistry, chemical reactions'),
        ('Biology', 'Study of living organisms and their interactions'),
        ('English', 'Language, literature, and communication skills'),
        ('History', 'World history and historical analysis'),
        ('Geography', 'Physical and human geography, environmental studies')
      ON CONFLICT (name) DO NOTHING;
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

// Run the initialization if this file is run directly
if (require.main === module) {
  initializeDatabase()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('Failed to initialize database:', error);
      process.exit(1);
    });
}

module.exports = initializeDatabase; 