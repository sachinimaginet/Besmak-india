import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Precision Manufacturing Solutions
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Besmak India delivers high-quality industrial components for B2B
            needs. Explore our catalog of 500+ products.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center bg-white text-blue-900 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors"
          >
            View Our Products
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              About Besmak India
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We are a leading manufacturer specializing in industrial parts
              with over 20 years of experience. Our commitment to quality and
              precision makes us the preferred partner for businesses worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products (Placeholder) */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Featured Products
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
                    className="text-blue-600 font-medium hover:underline"
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
              className="inline-block border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
