import Link from "next/link";

interface FeaturedProductsProps {
  content?: {
    title?: string;
  };
}

export default function FeaturedProducts({ content }: FeaturedProductsProps) {
  const { title = "Featured Products" } = content || {};

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
          {title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">Product Image {item}</span>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">
                  Industrial Component {item}
                </h3>
                <p className="text-gray-600 mb-4">
                  High-performance component specification summary.
                </p>
                <Link
                  href={`/products/product-slug-${item}`}
                  className="text-primary font-medium hover:underline"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-block border-2 border-primary text-primary px-8 py-3 rounded-full font-bold hover:bg-primary/5 transition-colors"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
