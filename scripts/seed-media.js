const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function seedMedia() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not defined in .env");
    process.exit(1);
  }

  const pool = createPool({
    uri: url,
    ssl: url.includes("ssl=false") ? undefined : { rejectUnauthorized: false },
  });

  const sampleMedia = [
    {
      id: "seed-1",
      url: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800",
      filename: "factory-industrial.jpg",
      contentType: "image/jpeg",
    },
    {
      id: "seed-2",
      url: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=800",
      filename: "machinery-part.jpg",
      contentType: "image/jpeg",
    },
    {
      id: "seed-3",
      url: "https://images.unsplash.com/photo-1565151443833-29bf2ba5dd8d?auto=format&fit=crop&q=80&w=800",
      filename: "engineering-blueprint.jpg",
      contentType: "image/jpeg",
    },
  ];

  try {
    console.log("Seeding media table...");
    const now = new Date();

    for (const item of sampleMedia) {
      await pool.execute(
        "INSERT IGNORE INTO media (id, url, filename, contentType, size, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [item.id, item.url, item.filename, item.contentType, 0, now, now],
      );
      console.log(`Inserted: ${item.filename}`);
    }
    console.log("Media table seeded successfully.");
  } catch (error) {
    console.error("Error seeding media table:", error);
  } finally {
    await pool.end();
  }
}

seedMedia();
