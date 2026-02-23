import Link from "next/link";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: {
    name: string;
  };
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-600">
          No products found.
        </h2>
        <p className="text-gray-500 mt-2">Try adjusting your search terms.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
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
  );
}
