const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function cleanupDuplicates() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not defined in .env");
    process.exit(1);
  }

  const pool = createPool({
    uri: url,
    ssl: url.includes("ssl=false") ? undefined : { rejectUnauthorized: false },
  });

  const tablesToDelete = ["products", "enquiries", "categories"];

  try {
    console.log("--- CLEANING UP REDUNDANT TABLES ---");
    for (const table of tablesToDelete) {
      console.log(`Deleting ${table}...`);
      await pool.execute(`DROP TABLE IF EXISTS ${table}`);
      console.log(`${table} deleted.`);
    }
    console.log("Cleanup complete.");
  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await pool.end();
  }
}

cleanupDuplicates();
