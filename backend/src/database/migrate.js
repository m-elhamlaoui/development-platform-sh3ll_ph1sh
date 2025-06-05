require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs').promises;
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

async function runMigrations() {
  const client = await pool.connect();
  
  try {
    // Start transaction
    await client.query('BEGIN');

    // Read migration file
    const migrationPath = path.join(__dirname, 'migrations', '001_initial_schema.sql');
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');
    
    // Split the SQL file into statements, being careful with dollar-quoted strings
    const statements = migrationSQL
      .split(/;\s*$/)
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0)
      // Remove any comments
      .map(statement => statement.replace(/--.*$/gm, ''))
      .filter(statement => statement.length > 0);

    // Execute each statement separately
    for (const statement of statements) {
      try {
        await client.query(statement);
        console.log('Executed statement successfully');
      } catch (error) {
        console.error('Error executing statement:', statement);
        throw error;
      }
    }

    // Commit transaction
    await client.query('COMMIT');
    console.log('Migration completed successfully');
  } catch (error) {
    // Rollback transaction on error
    await client.query('ROLLBACK');
    console.error('Migration failed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migrations
runMigrations().catch(console.error); 