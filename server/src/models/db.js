const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

// Create MySQL Connection Pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "root",
  database: process.env.DB_NAME || "test",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Check database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Database Connection Failed:", err.message);
  } else {
    console.log("✅ Database Connected Successfully to:", process.env.DB_NAME);
    connection.release();
  }
});

// Function to create necessary tables
const createTables = async () => {
  try {
    console.log("🔍 Checking Tables...");

    const candidatesTable = `
      CREATE TABLE IF NOT EXISTS candidates (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(15) NULL,
      skills TEXT NULL,
      experience TEXT NULL, -- Changed from INT to TEXT to allow experience description
      dob DATE NULL,
      address TEXT NULL,
      education TEXT NULL,
      resume VARCHAR(255) NULL,
      applied_requirement_ids TEXT DEFAULT NULL,
      user_id VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
      );
    `;

    const requirementsTable = `
      CREATE TABLE IF NOT EXISTS requirements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        location VARCHAR(255) NOT NULL, 
        work_location_type ENUM('On-site', 'Hybrid', 'Remote') NOT NULL,
        experience_required INT NOT NULL
      );
    `;

    const recruitersTable = `
      CREATE TABLE IF NOT EXISTS recruiters (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) UNIQUE NOT NULL,
         password VARCHAR(255) NOT NULL
      );
    `;

    // Execute table creation queries
    await executeQuery(requirementsTable, "Requirements table is ready");
    await executeQuery(candidatesTable, "Candidates table is ready");
    await executeQuery(recruitersTable, "Recruiters table is ready");

    console.log("✅ All Tables Checked & Ready");
  } catch (error) {
    console.error("❌ Error in table creation:", error);
  }
};

// Helper function to execute queries
const executeQuery = (query, successMessage) => {
  return new Promise((resolve, reject) => {
    db.query(query, (err) => {
      if (err) {
        console.error(`❌ Error executing query: ${query}`, err);
        reject(err);
      } else {
        console.log(`✅ ${successMessage}`);
        resolve();
      }
    });
  });
};

// Run table creation on startup
createTables();

module.exports = db;
