const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function seedData() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not defined in .env");
    process.exit(1);
  }

  const pool = createPool({
    uri: url,
    ssl: url.includes("ssl=false") ? undefined : { rejectUnauthorized: false },
  });

  const categories = [
    { id: "cat-1", name: "Valves", slug: "valves" },
    { id: "cat-2", name: "Pumps", slug: "pumps" },
    { id: "cat-3", name: "Gears", slug: "gears" },
  ];

  const products = [
    {
      id: "1",
      name: "Industrial Valve X100",
      slug: "industrial-valve-x100",
      description:
        "High-pressure industrial valve suitable for chemical processing.",
      categoryId: "cat-1",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1581092160562-40aa08e78837",
      ]),
      specifications: JSON.stringify({
        Material: "Stainless Steel",
        Pressure: "100 PSI",
      }),
    },
    {
      id: "2",
      name: "Hydraulic Pump H200",
      slug: "hydraulic-pump-h200",
      description: "Heavy-duty hydraulic pump for construction machinery.",
      categoryId: "cat-2",
      images: JSON.stringify([
        "https://images.unsplash.com/photo-1542281286-9e0a16bb7366",
      ]),
      specifications: JSON.stringify({ Power: "5000 W", Flow: "50 L/min" }),
    },
  ];

  try {
    const now = new Date();

    console.log("Seeding categories...");
    for (const cat of categories) {
      await pool.execute(
        "INSERT IGNORE INTO categories (id, name, slug, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?)",
        [cat.id, cat.name, cat.slug, now, now],
      );
    }

    console.log("Seeding products...");
    for (const prod of products) {
      await pool.execute(
        "INSERT IGNORE INTO products (id, name, slug, description, categoryId, images, specifications, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          prod.id,
          prod.name,
          prod.slug,
          prod.description,
          prod.categoryId,
          prod.images,
          prod.specifications,
          now,
          now,
        ],
      );
    }

    console.log("Data seeded successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await pool.end();
  }
}

seedData();
