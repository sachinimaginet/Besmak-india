import { query as dbQuery } from "@/lib/db";
import { notFound } from "next/navigation";
import ProductForm from "@/components/admin/ProductForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const products = await dbQuery<any[]>(
    "SELECT * FROM product WHERE id = ? LIMIT 1",
    [params.id],
  );
  const product = products[0];

  if (!product) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          href="/admin/products"
          className="text-blue-600 hover:text-blue-800 flex items-center mb-4 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          Edit Product: {product.name}
        </h1>
      </div>

      <ProductForm initialData={product} isEdit={true} />
    </div>
  );
}
