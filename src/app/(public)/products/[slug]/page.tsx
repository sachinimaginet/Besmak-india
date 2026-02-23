import { query as dbQuery } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const sql = `
    SELECT p.*, c.name as categoryName 
    FROM product p 
    JOIN category c ON p.categoryId = c.id 
    WHERE p.slug = ? 
    LIMIT 1
  `;

  const results = await dbQuery(sql, [params.slug]);
  const rawProduct = results[0];

  if (!rawProduct) {
    notFound();
  }

  // Parse JSON fields manually since we're using raw driver
  const product = {
    ...rawProduct,
    category: {
      name: rawProduct.categoryName,
    },
    specifications: rawProduct.specifications
      ? JSON.parse(rawProduct.specifications)
      : null,
    images: rawProduct.images ? JSON.parse(rawProduct.images) : null,
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/products"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Catalog
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-12 bg-white rounded-xl shadow-sm p-6 md:p-8">
        {/* Images */}
        <div className="bg-gray-100 rounded-lg h-96 flex items-center justify-center overflow-hidden">
          <span className="text-gray-400 text-lg">
            Product Image Placeholder
          </span>
        </div>

        {/* Info */}
        <div className="flex flex-col h-full">
          <div>
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider mb-4">
              {product.category.name}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4 border-b pb-2">
              Technical Specifications
            </h3>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
              {product.specifications &&
                Object.entries(
                  product.specifications as Record<string, any>,
                ).map(([key, value]) => (
                  <div key={key} className="sm:col-span-1">
                    <dt className="text-sm font-medium text-gray-500">{key}</dt>
                    <dd className="mt-1 text-sm font-semibold text-gray-900">
                      {String(value)}
                    </dd>
                  </div>
                ))}
            </dl>
          </div>

          {/* Enquiry Form */}
          <div className="mt-auto pt-8 border-t border-gray-100">
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Request a Quote
            </h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                    placeholder="you@company.com"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={3}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm p-2 border"
                  defaultValue={`I am interested in ${product.name}. Please send pricing and availability.`}
                ></textarea>
              </div>
              <button
                type="button"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Send Enquiry
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
