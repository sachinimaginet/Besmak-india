import { query as dbQuery } from "@/lib/db";
import { notFound } from "next/navigation";
import CategoryForm from "@/components/admin/CategoryForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const categories = await dbQuery<any[]>(
    "SELECT * FROM category WHERE id = ? LIMIT 1",
    [params.id],
  );
  const category = categories[0];

  if (!category) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <Link
          href="/admin/categories"
          className="text-blue-600 hover:text-blue-800 flex items-center mb-4 transition-colors font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Categories
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">
          Edit Category: {category.name}
        </h1>
      </div>

      <CategoryForm initialData={category} isEdit={true} />
    </div>
  );
}
