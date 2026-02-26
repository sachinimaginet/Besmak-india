const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function checkDescriptions() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL not found");
    return;
  }

  const pool = createPool({
    uri: url,
    ssl: url.includes("ssl=false") ? undefined : { rejectUnauthorized: false },
  });

  try {
    console.log("Fetching description column from product table...");
    const [rows] = await pool.execute(
      "SELECT id, name, description FROM product LIMIT 10",
    );
    console.log("Product Descriptions Data:");
    rows.forEach((row) => {
      console.log(
        `ID: ${row.id}, Name: ${row.name}, Description: "${row.description}"`,
      );
    });
  } catch (error) {
    console.error("Error checking descriptions:", error);
  } finally {
    await pool.end();
  }
}

checkDescriptions();
