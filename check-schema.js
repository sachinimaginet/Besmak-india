import { query as dbQuery } from "./src/lib/db";

async function checkSchema() {
  try {
    const columns = await dbQuery("SHOW COLUMNS FROM product");
    console.log(JSON.stringify(columns, null, 2));
  } catch (err) {
    console.error(err);
  }
}

checkSchema();
