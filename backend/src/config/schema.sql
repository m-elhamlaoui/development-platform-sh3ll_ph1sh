-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  subject VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  stored_file_name VARCHAR(255) NOT NULL,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create index on subject for faster queries
CREATE INDEX idx_files_subject ON files(subject);

-- Create index on user_id for faster queries
CREATE INDEX idx_files_user_id ON files(user_id); 