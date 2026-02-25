const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function checkColumnExistence() {
  const url = process.env.DATABASE_URL;
  const pool = createPool({
    uri: url,
    ssl: url.includes("ssl=false") ? undefined : { rejectUnauthorized: false },
  });

  try {
    const [rows] = await pool.execute("DESCRIBE product");
    const columnExists = rows.some(
      (row) => row.Field === "categorySpecification",
    );
    if (columnExists) {
      console.log("COLUMN_EXISTS: YES");
    } else {
      console.log("COLUMN_EXISTS: NO");
      console.log("Current columns:", rows.map((r) => r.Field).join(", "));
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await pool.end();
  }
}

checkColumnExistence();
