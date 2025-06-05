-- Create database if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_database WHERE datname = 'eduinpt_db') THEN
        CREATE DATABASE eduinpt_db;
    END IF;
END $$;

-- Connect to the database
\c eduinpt_db;

-- Create users table
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

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create files table
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    stored_file_name VARCHAR(255) NOT NULL,
    is_favorite BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial subjects
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