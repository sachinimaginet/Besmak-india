import { query as dbQuery } from "./src/lib/db.js";

async function checkSlugs() {
  try {
    const products = await dbQuery(
      "SELECT id, name, slug FROM product WHERE slug LIKE '1f-250-cls%'",
    );
    console.log("Matching products:", JSON.stringify(products, null, 2));
  } catch (error) {
    console.error("Error checking slugs:", error);
  } finally {
    process.exit();
  }
}

checkSlugs();
