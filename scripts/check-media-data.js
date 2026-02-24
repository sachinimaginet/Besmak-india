const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function checkMedia() {
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
    console.log("Checking media table content...");
    const [rows] = await pool.execute("SELECT * FROM media");
    console.log(`Found ${rows.length} items.`);
    console.table(rows);
  } catch (error) {
    console.error("Error checking media:", error);
  } finally {
    await pool.end();
  }
}

checkMedia();
