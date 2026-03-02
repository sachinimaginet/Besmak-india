const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function migrate() {
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
      name: "pages",
      sql: `
        CREATE TABLE IF NOT EXISTS pages (
          id VARCHAR(255) PRIMARY KEY,
          slug VARCHAR(255) NOT NULL UNIQUE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          keywords TEXT,
          isActive BOOLEAN DEFAULT TRUE,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
      `,
    },
    {
      name: "page_sections",
      sql: `
        CREATE TABLE IF NOT EXISTS page_sections (
          id VARCHAR(255) PRIMARY KEY,
          pageId VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          content JSON NOT NULL,
          sortOrder INT DEFAULT 0,
          isActive BOOLEAN DEFAULT TRUE,
          createdAt DATETIME NOT NULL,
          updatedAt DATETIME NOT NULL,
          FOREIGN KEY (pageId) REFERENCES pages(id) ON DELETE CASCADE
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

    // Seed home page if not exists
    const [rows] = await pool.execute(
      "SELECT id FROM pages WHERE slug = 'home'",
    );
    if (rows.length === 0) {
      console.log("Seeding initial home page content...");
      const pageId = "home-page-id";
      const now = new Date().toISOString().slice(0, 19).replace("T", " ");

      await pool.execute(
        "INSERT INTO pages (id, slug, title, description, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
        [pageId, "home", "Home", "Precision Manufacturing Solutions", now, now],
      );

      const sections = [
        {
          id: "hero-section",
          type: "hero",
          content: JSON.stringify({
            title: "Precision Manufacturing Solutions",
            subtitle:
              "Besmak India delivers high-quality industrial components for B2B needs. Explore our catalog of 500+ products.",
            ctaText: "View Our Products",
            ctaLink: "/products",
          }),
          sortOrder: 0,
        },
        {
          id: "about-section",
          type: "about",
          content: JSON.stringify({
            title: "About Besmak India",
            description:
              "We are a leading manufacturer specializing in industrial parts with over 20 years of experience. Our commitment to quality and precision makes us the preferred partner for businesses worldwide.",
          }),
          sortOrder: 1,
        },
        {
          id: "featured-products-section",
          type: "featured-products",
          content: JSON.stringify({
            title: "Featured Products",
          }),
          sortOrder: 2,
        },
      ];

      for (const section of sections) {
        await pool.execute(
          "INSERT INTO page_sections (id, pageId, type, content, sortOrder, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [
            section.id,
            pageId,
            section.type,
            section.content,
            section.sortOrder,
            now,
            now,
          ],
        );
      }
      console.log("Initial home page content seeded.");
    }

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await pool.end();
  }
}

migrate();
