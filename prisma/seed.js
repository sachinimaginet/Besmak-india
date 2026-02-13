const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const categories = [
  { name: "Valves", slug: "valves", image: "/categories/valves.jpg" },
  { name: "Pumps", slug: "pumps", image: "/categories/pumps.jpg" },
  { name: "Gears", slug: "gears", image: "/categories/gears.jpg" },
  { name: "Belts", slug: "belts", image: "/categories/belts.jpg" },
  {
    name: "Electronics",
    slug: "electronics",
    image: "/categories/electronics.jpg",
  },
];

const products = [
  {
    name: "Industrial Valve X100",
    slug: "industrial-valve-x100",
    description:
      "High-pressure industrial valve suitable for chemical processing.",
    categorySlug: "valves",
    specifications: { Material: "Stainless Steel", Pressure: "100 PSI" },
    images: ["/placeholder.jpg"],
  },
  {
    name: "Hydraulic Pump H200",
    slug: "hydraulic-pump-h200",
    description: "Heavy-duty hydraulic pump for construction machinery.",
    categorySlug: "pumps",
    specifications: { Power: "5000 W", Flow: "50 L/min" },
    images: ["/placeholder.jpg"],
  },
  // Add more from dummy-data.ts logic if needed
];

async function main() {
  console.log("Seeding database...");

  // Create Categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Create Products
  for (const prod of products) {
    const category = await prisma.category.findUnique({
      where: { slug: prod.categorySlug },
    });
    if (category) {
      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {},
        create: {
          name: prod.name,
          slug: prod.slug,
          description: prod.description,
          specifications: prod.specifications,
          images: JSON.stringify(prod.images),
          categoryId: category.id,
        },
      });
    }
  }

  // Create Admin User
  await prisma.adminUser.upsert({
    where: { email: "admin@besmak.com" },
    update: {},
    create: {
      email: "admin@besmak.com",
      password: "admin", // In production, hash this!
      name: "Admin User",
    },
  });

  console.log("Seeding finished.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
