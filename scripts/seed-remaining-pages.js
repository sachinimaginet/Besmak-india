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
      id: "divisions-page",
      slug: "divisions",
      title: "Manufacturing Divisions | Besmak India",
      description:
        "Explore our specialized divisions for precision manufacturing of industrial components.",
      sections: [
        {
          id: "div-hero",
          type: "hero",
          content: {
            title: "Our Divisions",
            subtitle:
              "Specialized manufacturing excellence across multiple industries.",
          },
          order: 0,
        },
      ],
    },
    {
      id: "events-page",
      slug: "events",
      title: "Corporate Events & News | Besmak India",
      description:
        "Stay updated with recent events, exhibitions, and news from Besmak India.",
      sections: [
        {
          id: "events-hero",
          type: "hero",
          content: {
            title: "Events & News",
            subtitle: "Sharing our milestones and industrial achievements.",
          },
          order: 0,
        },
      ],
    },
    {
      id: "contact-page",
      slug: "contact",
      title: "Contact Us | Besmak India",
      description:
        "Get in touch with Besmak India for inquiries, partnerships, and precision component manufacturing needs.",
      sections: [
        {
          id: "contact-hero",
          type: "hero",
          content: {
            title: "Contact Besmak India",
            subtitle:
              "We are here to assist with your industrial requirements.",
          },
          order: 0,
        },
      ],
    },
  ];

  try {
    for (const page of pages) {
      console.log(`Seeding page: ${page.slug}...`);
      await pool.execute(
        `INSERT INTO pages (id, slug, title, description, keywords, createdAt, updatedAt) 
         VALUES (?, ?, ?, ?, ?, ?, ?) 
         ON DUPLICATE KEY UPDATE title=VALUES(title), description=VALUES(description), updatedAt=VALUES(updatedAt)`,
        [page.id, page.slug, page.title, page.description, "", now, now],
      );

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
