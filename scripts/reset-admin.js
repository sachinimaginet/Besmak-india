const { createPool } = require("mysql2/promise");
const bcrypt = require("bcryptjs");
require("dotenv").config();

async function resetAdminPassword() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error("DATABASE_URL is not defined in .env");
    process.exit(1);
  }

  const pool = createPool({
    uri: url,
    ssl: url.includes("ssl=false") ? undefined : { rejectUnauthorized: false },
  });

  const email = "admin@besmak.com";
  const password = "Besmak@2024";

  try {
    console.log("Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("Updating admin user...");

    // Check if user exists
    const [users] = await pool.execute(
      "SELECT * FROM adminuser WHERE email = ?",
      [email],
    );

    if (users.length > 0) {
      await pool.execute("UPDATE adminuser SET password = ? WHERE email = ?", [
        hashedPassword,
        email,
      ]);
      console.log("Admin password updated successfully.");
    } else {
      console.log("Admin user not found, creating new one...");
      await pool.execute(
        "INSERT INTO adminuser (id, email, password) VALUES (?, ?, ?)",
        [crypto.randomUUID(), email, hashedPassword],
      );
      console.log("Admin user created successfully.");
    }

    console.log("\n--- Credentials ---");
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log("-------------------\n");
  } catch (error) {
    console.error("Error resetting admin password:", error);
  } finally {
    await pool.end();
  }
}

// Simple crypto.randomUUID fallback for Node.js < 19
const crypto = require("crypto");
if (!crypto.randomUUID) {
  crypto.randomUUID = () => crypto.randomBytes(16).toString("hex");
}

resetAdminPassword();
