const { createPool } = require("mysql2/promise");
require("dotenv").config();

async function addSettingsTable() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not defined in .env");
    process.exit(1);
  }

  const pool = createPool({
    uri: url,
    ssl: url.includes("ssl=false") ? undefined : { rejectUnauthorized: false },
  });

  const sql = `
    CREATE TABLE IF NOT EXISTS site_settings (
      id VARCHAR(50) PRIMARY KEY,
      value TEXT NOT NULL,
      updatedAt DATETIME NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `;

  try {
    console.log("Creating site_settings table...");
    await pool.execute(sql);
    console.log("Table site_settings ready.");

    // Initialize with default values if not present
    const defaults = [
      { id: "primary_color", value: "#284b8c" },
      { id: "logo_url", value: "/images/Besmak-Logo.png" },
      { id: "heading_font", value: "Inter" },
      { id: "body_font", value: "Inter" },
      { id: "h1_font_size", value: "48" },
      { id: "h2_font_size", value: "36" },
      { id: "h3_font_size", value: "30" },
      { id: "h4_font_size", value: "24" },
      { id: "h5_font_size", value: "20" },
      { id: "h6_font_size", value: "18" },
      { id: "body_font_size", value: "16" },
    ];

    const now = new Date().toISOString().slice(0, 19).replace("T", " ");

    for (const { id, value } of defaults) {
      const [rows] = await pool.execute(
        "SELECT id FROM site_settings WHERE id = ?",
        [id],
      );
      if (rows.length === 0) {
        console.log(`Initializing default: ${id}...`);
        await pool.execute(
          "INSERT INTO site_settings (id, value, updatedAt) VALUES (?, ?, ?)",
          [id, value, now],
        );
      }
    }

    console.log("Settings initialization completed successfully.");
  } catch (error) {
    console.error("Error during settings migration:", error);
  } finally {
    await pool.end();
  }
}

addSettingsTable();
