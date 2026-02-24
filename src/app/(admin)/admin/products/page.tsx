import { query as dbQuery } from "@/lib/db";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import BulkUpload from "@/components/admin/BulkUpload";
import DeleteProductButton from "@/components/admin/DeleteProductButton";

export default async function AdminProductsPage() {
  const sql = `
    SELECT p.*, c.name as categoryName 
    FROM product p 
    LEFT JOIN category c ON p.categoryId = c.id 
    ORDER BY p.createdAt DESC
  `;

  const products = await dbQuery<any[]>(sql);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        No products found in the database.
                      </td>
                    </tr>
                  ) : (
                    products.map((product) => (
                      <tr
                        key={product.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            ID: {product.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {product.categoryName || "Uncategorized"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-3">
                            <Link
                              href={`/admin/products/edit/${product.id}`}
                              className="text-blue-600 hover:text-blue-900 p-1"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <DeleteProductButton
                              productId={product.id}
                              productName={product.name}
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <BulkUpload />
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg mr-2">
                <Plus className="h-4 w-4" />
              </span>
              Instructions
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload an Excel file (.xlsx) with the following columns:
            </p>
            <ul className="text-sm text-gray-600 space-y-2 list-none">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 bg-blue-400 rounded-full mr-2"></div>
                <span>
                  <strong>Name:</strong> Product Title
                </span>
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 bg-blue-400 rounded-full mr-2"></div>
                <span>
                  <strong>Category:</strong> Category ID or Name
                </span>
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 bg-blue-400 rounded-full mr-2"></div>
                <span>
                  <strong>Description:</strong> detailed text
                </span>
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 bg-blue-400 rounded-full mr-2"></div>
                <span>
                  <strong>Specifications:</strong> JSON format data
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
