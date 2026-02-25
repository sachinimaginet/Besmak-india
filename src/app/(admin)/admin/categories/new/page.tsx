import CategoryForm from "@/components/admin/CategoryForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewCategoryPage() {
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
        <h1 className="text-3xl font-bold text-gray-800">Add New Category</h1>
      </div>

      <CategoryForm />
    </div>
  );
}
