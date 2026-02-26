import Link from "next/link";
import Image from "next/image";
import { ImageIcon } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  images: string | null;
  specifications: string | null;
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
      {products.map((product) => {
        let images = [];
        try {
          if (product.images) {
            if (typeof product.images === "string") {
              const decoded = JSON.parse(product.images);
              images = Array.isArray(decoded) ? decoded : [];
            } else if (Array.isArray(product.images)) {
              images = product.images;
            }
          }
        } catch (error) {
          console.error(
            `Error parsing images for product ${product.id}:`,
            error,
          );
          images = [];
        }

        const featuredImage =
          images.length > 0 && typeof images[0] === "string" ? images[0] : null;

        // Dynamic Description Logic
        let specsSummary = "";
        try {
          if (!product.description && product.specifications) {
            const specs =
              typeof product.specifications === "string"
                ? JSON.parse(product.specifications)
                : product.specifications;

            if (specs && typeof specs === "object") {
              // Pick 3 interesting keys to build a summary
              const relevantKeys = [
                "Series",
                "Way",
                "Material",
                "M / F",
                "Tab Size",
              ];
              const parts = [];
              for (const key of relevantKeys) {
                if (specs[key]) {
                  parts.push(`${key}: ${specs[key]}`);
                }
                if (parts.length >= 3) break;
              }
              specsSummary = parts.join(" | ");
            }
          }
        } catch (e) {
          console.error("Error generating specs summary:", e);
        }

        return (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group block bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow h-full"
          >
            <div className="h-56 bg-gray-100 flex items-center justify-center relative overflow-hidden">
              {featuredImage ? (
                <Image
                  src={featuredImage}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-400">
                  <ImageIcon className="h-10 w-10 opacity-20" />
                  <span className="text-xs uppercase tracking-wider font-medium opacity-50">
                    No image available
                  </span>
                </div>
              )}
            </div>
            <div className="p-5">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">
                {product.category.name}
              </span>
              <h3 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {product.name}
              </h3>
              <p className="mt-2 text-sm text-gray-500 line-clamp-2 leading-relaxed">
                {product.description ||
                  specsSummary ||
                  "Premium quality industrial component from Besmak India."}
              </p>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-blue-600 text-sm font-semibold">
                View Details
                <svg
                  className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
