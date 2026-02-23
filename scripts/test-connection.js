const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://admin:ec8b036e2c4215b0597d7470ca416756ce13406479b88bee@209.38.120.144:3306/besmak_india?sslmode=REQUIRED&allowPublicKeyRetrieval=true",
    },
  },
});

async function main() {
  console.log("Testing connection to 209.38.120.144 with sslmode=REQUIRED...");
  try {
    const start = Date.now();
    await prisma.$connect();
    console.log("Connection successful in", Date.now() - start, "ms");
  } catch (error) {
    console.error("Connection failed:");
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
