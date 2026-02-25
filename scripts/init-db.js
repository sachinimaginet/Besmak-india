const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function initDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not defined in .env");
    process.exit(1);
  }

  const pool = createPool({
    uri: url,
    ssl: url.includes("ssl=false") ? undefined : { rejectUnauthorized: false },
  });

  const tables = [
    {
      name: "category",
      sql: `
        CREATE TABLE IF NOT EXISTS category (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `,
    },
    {
      name: "product",
      sql: `
        CREATE TABLE IF NOT EXISTS product (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          slug VARCHAR(255) NOT NULL UNIQUE,
          description TEXT,
          categoryId VARCHAR(255),
          categorySpecification VARCHAR(255),
          images JSON,
          specifications JSON,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL,
          FOREIGN KEY (categoryId) REFERENCES category(id) ON DELETE SET NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `,
    },
    {
      name: "enquiries",
      sql: `
        CREATE TABLE IF NOT EXISTS enquiries (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          productId VARCHAR(255),
          status VARCHAR(50) DEFAULT 'PENDING',
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `,
    },
  ];

  try {
    for (const table of tables) {
      console.log(`Creating table: ${table.name}...`);
      await pool.execute(table.sql);
      console.log(`Table ${table.name} ready.`);
    }
    console.log("All tables initialized successfully.");
  } catch (error) {
    console.error("Error initializing database:", error);
  } finally {
    await pool.end();
  }
}

initDb();
