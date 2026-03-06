const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function check() {
  const url = process.env.DATABASE_URL;
  const pool = createPool({
    uri: url,
    ssl: url.includes("ssl=false") ? undefined : { rejectUnauthorized: false },
  });
  try {
    const [cols] = await pool.query("SHOW COLUMNS FROM enquiry");
    cols.forEach((col) => console.log(col.Field));
  } catch (err) {
    console.error("enquiry table error:", err.message);
    try {
      const [cols] = await pool.query("SHOW COLUMNS FROM enquiries");
      cols.forEach((col) => console.log(col.Field));
    } catch (err2) {
      console.error("enquiries table error:", err2.message);
    }
  } finally {
    await pool.end();
  }
}
check();
