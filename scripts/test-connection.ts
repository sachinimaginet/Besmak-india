
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "mysql://admin:ec8b036e2c4215b0597d7470ca416756ce13406479b88bee@209.38.120.144:3306/besmak_india"
    }
  }
});

async function main() {
  try {
    const products = await prisma.product.findMany({ take: 1 });
    console.log('Connection successful! Found products:', products.length);
  } catch (error) {
    console.error('Connection failed with the provided URL:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
