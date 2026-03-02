const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function check() {
  const url = process.env.DATABASE_URL;
  const pool = createPool({
    uri: url,
    ssl: url.includes("ssl=false") ? undefined : { rejectUnauthorized: false },
  });

  try {
    const [rows] = await pool.execute(
      "SELECT slug, title, description FROM pages",
    );
    console.log("Existing Pages in DB:");
    console.table(rows);
  } catch (error) {
    console.error("Check failed:", error);
  } finally {
    await pool.end();
  }
}

check();
