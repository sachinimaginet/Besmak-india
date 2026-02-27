import { createPool } from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

async function checkSlugs() {
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
    const [rows] = await pool.execute(
      "SELECT id, name, slug FROM product WHERE slug LIKE '1f-250-cls%'",
    );
    console.log("Matching products:", JSON.stringify(rows, null, 2));
  } catch (error) {
    console.error("Error checking slugs:", error);
  } finally {
    await pool.end();
    process.exit();
  }
}

checkSlugs();
