const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function fixSchema() {
  const url = process.env.DATABASE_URL;
  if (!url) return;

  const pool = createPool({
    uri: url,
    ssl: url.includes("ssl=false") ? undefined : { rejectUnauthorized: false },
  });

  try {
    console.log("Altering product table to allow NULL categoryId...");
    await pool.execute(
      "ALTER TABLE product MODIFY categoryId VARCHAR(255) NULL",
    );
    console.log("Schema fixed successfully.");
  } catch (error) {
    console.error("Error fixing schema:", error);
  } finally {
    await pool.end();
  }
}

fixSchema();
