const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function checkSpecs() {
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
    console.log("Fetching specifications column from product table...");
    const [rows] = await pool.execute(
      "SELECT id, name, specifications, categorySpecification FROM product LIMIT 5",
    );
    console.log("Product Data:");
    rows.forEach((row) => {
      console.log(`ID: ${row.id}, Name: ${row.name}`);
      console.log(`  Specs: ${row.specifications}`);
      console.log(`  CatSpec: ${row.categorySpecification}`);
    });
  } catch (error) {
    console.error("Error checking specs:", error);
  } finally {
    await pool.end();
  }
}

checkSpecs();
