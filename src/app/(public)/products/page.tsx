import prisma from "@/lib/prisma";
import ProductHeader from "@/components/sections/products/ProductHeader";
import ProductGrid from "@/components/sections/products/ProductGrid";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q?.toLowerCase() || "";

  const filteredProducts = await prisma.product.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { category: { name: { contains: query } } },
      ],
    },
    include: {
      category: true,
    },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductHeader query={query} />
      <ProductGrid products={filteredProducts} />
    </div>
  );
}
