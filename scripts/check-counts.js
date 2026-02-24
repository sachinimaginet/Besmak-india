const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function checkCounts() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not defined in .env");
    process.exit(1);
  }

  const pool = createPool({
    uri: url,
    ssl: url.includes("ssl=false") ? undefined : { rejectUnauthorized: false },
  });

  const tablesToCheck = [
    "category",
    "categories",
    "enquiry",
    "enquiries",
    "product",
    "products",
  ];

  try {
    console.log("--- TABLE RECORD COUNTS ---");
    for (const table of tablesToCheck) {
      const [rows] = await pool.execute(
        `SELECT COUNT(*) as count FROM ${table}`,
      );
      console.log(`${table}: ${rows[0].count}`);
    }
    console.log("---------------------------");
  } catch (error) {
    console.error("Error checking counts:", error);
  } finally {
    await pool.end();
  }
}

checkCounts();
