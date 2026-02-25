const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function checkColumns() {
  const url = process.env.DATABASE_URL;
  const pool = createPool({
    uri: url,
    ssl: url.includes("ssl=false") ? undefined : { rejectUnauthorized: false },
  });

  try {
    const [rows] = await pool.execute("DESCRIBE product");
    console.log("--- product table columns ---");
    rows.forEach((row) => {
      console.log(`${row.Field} (${row.Type})`);
    });
    console.log("----------------------------");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await pool.end();
  }
}

checkColumns();
