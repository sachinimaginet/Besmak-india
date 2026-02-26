import { query as dbQuery } from "@/lib/db";
import ProductHeader from "@/components/sections/products/ProductHeader";
import ProductGrid from "@/components/sections/products/ProductGrid";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q?.toLowerCase() || "";

  const sql = `
    SELECT p.*, c.name as categoryName 
    FROM product p 
    LEFT JOIN category c ON p.categoryId = c.id 
    WHERE p.name LIKE ? OR (c.name IS NOT NULL AND c.name LIKE ?)
  `;

  const products = await dbQuery(sql, [`%${query}%`, `%${query}%`]);

  const filteredProducts = products.map((p: any) => ({
    ...p,
    category: {
      name: p.categoryName,
    },
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductHeader query={query} />
      <ProductGrid products={filteredProducts} />
    </div>
  );
}
