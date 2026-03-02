const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function seed() {
  const url = process.env.DATABASE_URL;
  const pool = createPool({
    uri: url,
    ssl: url.includes("ssl=false") ? undefined : { rejectUnauthorized: false },
  });

  const now = new Date().toISOString().slice(0, 19).replace("T", " ");

  const pages = [
    {
      id: "about-page",
      slug: "about-us",
      title: "About Us | Besmak India",
      description:
        "Learn about Besmak India's journey, our commitment to precision manufacturing, and our story since 2004.",
      sections: [
        {
          id: "about-hero-1",
          type: "about-hero",
          content: {
            title: "About Besmak India",
            description:
              "Delivering precision and quality in industrial manufacturing for over two decades.",
          },
          order: 0,
        },
        {
          id: "about-content-1",
          type: "about-content",
          content: {
            title: "Our Story",
            description1:
              "Founded in 2004, Besmak India has grown from a small workshop to a leading name in precision manufacturing. We specialize in high-quality industrial components that meet the rigorous standards of B2B clients worldwide.",
            description2:
              "Our state-of-the-art facility and experienced team ensure that every part we produce is a testament to our commitment to excellence.",
          },
          order: 1,
        },
      ],
    },
    {
      id: "products-meta",
      slug: "products",
      title: "Industrial Products Catalog | Besmak India",
      description:
        "Browse our wide range of high-quality industrial components, valves, and custom parts.",
      sections: [], // Products page handles its own sections manually for now
    },
  ];

  try {
    for (const page of pages) {
      console.log(`Seeding page: ${page.slug}...`);

      // Upsert page
      await pool.execute(
        `INSERT INTO pages (id, slug, title, description, keywords, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), updatedAt=VALUES(updatedAt)`,
        [page.id, page.slug, page.title, page.description, "", now, now],
      );

      // Insert sections
      for (const section of page.sections) {
        await pool.execute(
          `INSERT INTO page_sections (id, pageId, type, content, sortOrder, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?) 
           ON DUPLICATE KEY UPDATE content=VALUES(content), sortOrder=VALUES(sortOrder), updatedAt=VALUES(updatedAt)`,
          [
            section.id,
            page.id,
            section.type,
            JSON.stringify(section.content),
            section.order,
            now,
            now,
          ],
        );
      }
    }
    console.log("Seeding completed.");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await pool.end();
  }
}

seed();
