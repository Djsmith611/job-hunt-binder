const pg = require("pg"); // Import the pg (node-postgres) module for interacting with PostgreSQL
let pool; // Initialize a variable to hold the database connection pool

// Check if the DATABASE_URL environment variable is set
if (process.env.DATABASE_URL) {
  // If DATABASE_URL is set, create a new pool with the connection string
  // and configure SSL settings for secure connections
  pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Allow self-signed certificates
    },
  });
} else {
  // If DATABASE_URL is not set, create a new pool with local PostgreSQL settings
  pool = new pg.Pool({
    host: "localhost", // Localhost as the database server
    port: 5432, // Default PostgreSQL port
    database: "job_hunt_binder", // Database name
  });
}

module.exports = pool; // Export the pool for use in other parts of the application
