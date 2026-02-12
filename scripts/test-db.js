const { PrismaClient } = require("@prisma/client");

async function checkConnection() {
  console.log("Initializing Prisma Client...");
  const prisma = new PrismaClient();

  try {
    console.log("Attempting to connect to database...");
    await prisma.$connect();
    console.log("✅ Database connection successful!");

    // Optional: Try a simple query
    try {
      const count = await prisma.product.count();
      console.log(`✅ Verified: Found ${count} products in database.`);
    } catch (qError) {
      console.log(
        "⚠️ Connection successful, but query failed (Table might not exist yet).",
      );
      console.log("Error:", qError.message);
    }
  } catch (error) {
    console.error("❌ Database connection failed.");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection();
