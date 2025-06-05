const { Pool } = require('pg');

// Parse the DATABASE_URL if it exists, otherwise use individual config
let poolConfig;
if (process.env.DATABASE_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
  };
} else {
  poolConfig = {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'eduinpt_db',
    password: process.env.DB_PASSWORD || '1234',
    port: process.env.DB_PORT || 5432,
  };
}

const pool = new Pool(poolConfig);

// Test the connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    console.error('Please check your database configuration and ensure PostgreSQL is running.');
    process.exit(1); // Exit if we can't connect to the database
  }
  console.log('Successfully connected to PostgreSQL database');
  release();
});

module.exports = pool; 