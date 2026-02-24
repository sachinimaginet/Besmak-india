const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function listTables() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not defined in .env");
    process.exit(1);
  }

  const pool = createPool({
    uri: url,
    ssl: url.includes("ssl=false") ? undefined : { rejectUnauthorized: false },
  });

  try {
    const [rows] = await pool.execute("SHOW TABLES");
    console.log("--- DATABASE TABLES ---");
    rows.forEach((row) => {
      console.log(Object.values(row)[0]);
    });
    console.log("-----------------------");
  } catch (error) {
    console.error("Error fetching tables:", error);
  } finally {
    await pool.end();
  }
}

listTables();
