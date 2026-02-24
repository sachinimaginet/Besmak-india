const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function createMediaTable() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not defined in .env");
    process.exit(1);
  }

  const pool = createPool({
    uri: url,
    ssl: url.includes("ssl=false") ? undefined : { rejectUnauthorized: false },
  });

  const sql = `
    CREATE TABLE IF NOT EXISTS media (
      id VARCHAR(255) PRIMARY KEY,
      url TEXT NOT NULL,
      filename VARCHAR(255) NOT NULL,
      contentType VARCHAR(100),
      size INT,
      createdAt DATETIME NOT NULL,
      updatedAt DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    console.log("Creating media table...");
    await pool.execute(sql);
    console.log("Media table created successfully or already exists.");
  } catch (error) {
    console.error("Error creating media table:", error);
  } finally {
    await pool.end();
  }
}

createMediaTable();
