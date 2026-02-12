import Link from "next/link";
import { DUMMY_PRODUCTS } from "@/lib/dummy-data";
import { Search } from "lucide-react";

export default function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q?.toLowerCase() || "";

  const filteredProducts = DUMMY_PRODUCTS.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.category.name.toLowerCase().includes(query),
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Product Catalog</h1>

        <form className="mt-4 md:mt-0 relative">
          <input
            type="text"
            name="q"
            placeholder="Search products..."
            defaultValue={query}
            className="pl-10 pr-4 py-2 border rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </form>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-600">
            No products found.
          </h2>
          <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group block bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                <span className="text-gray-400">Image: {product.name}</span>
              </div>
              <div className="p-4">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  {product.category.name}
                </span>
                <h3 className="mt-1 text-lg font-bold text-gray-900 group-hover:text-blue-600">
                  {product.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
