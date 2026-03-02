const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function check() {
  const url = process.env.DATABASE_URL;
  const pool = createPool({
    uri: url,
    ssl: url.includes("ssl=false") ? undefined : { rejectUnauthorized: false },
  });

  try {
    const [rows] = await pool.execute("SELECT slug, title FROM pages");
    console.log(JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error("Check failed:", error);
  } finally {
    await pool.end();
  }
}

check();
