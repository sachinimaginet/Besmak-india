import { query as dbQuery } from "@/lib/db";
import Link from "next/link";
import {
  Plus,
  Edit,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import BulkUpload from "@/components/admin/BulkUpload";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import SearchInput from "@/components/admin/SearchInput";

interface PageProps {
  searchParams: {
    search?: string;
    page?: string;
  };
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const searchTerm = searchParams.search || "";
  const keywords = searchTerm
    .trim()
    .split(/\s+/)
    .filter((k) => k.length > 0);
  const currentPage = parseInt(searchParams.page || "1") || 1;
  const itemsPerPage = 10;
  const offset = (currentPage - 1) * itemsPerPage;

  // Build dynamic WHERE clause for multi-word search
  let whereClause = "1=1";
  let queryParams: any[] = [];

  if (keywords.length > 0) {
    const nameConditions = keywords.map(() => "name LIKE ?").join(" AND ");
    whereClause = `(${nameConditions}) OR id LIKE ?`;
    queryParams = [...keywords.map((k) => `%${k}%`), `%${searchTerm}%`];
  }

  // 1. Get total count for pagination
  const countSql = `
    SELECT COUNT(*) as total 
    FROM product 
    WHERE ${whereClause}
  `;
  const countResult = await dbQuery<any[]>(countSql, queryParams);
  const totalProducts = countResult[0]?.total || 0;
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  // 2. Get paginated products
  const productsSql = `
    SELECT p.*, c.name as categoryName 
    FROM product p 
    LEFT JOIN category c ON p.categoryId = c.id 
    WHERE ${whereClause.replace(/name/g, "p.name").replace(/id/g, "p.id")}
    ORDER BY p.createdAt DESC
    LIMIT ? OFFSET ?
  `;
  const products = await dbQuery<any[]>(productsSql, [
    ...queryParams,
    itemsPerPage,
    offset,
  ]);

  const startIdx = totalProducts === 0 ? 0 : offset + 1;
  const endIdx = Math.min(offset + itemsPerPage, totalProducts);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Product Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Showing {startIdx}-{endIdx} of {totalProducts} products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Product
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <SearchInput />
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
                        {searchTerm
                          ? "No products found matching your search."
                          : "No products found in the database."}
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
                          {product.categorySpecification && (
                            <div className="text-[10px] text-gray-500 mt-1">
                              Spec: {product.categorySpecification}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-3">
                            <Link
                              href={`/products/${product.slug}`}
                              target="_blank"
                              className="text-gray-600 hover:text-blue-600 p-1"
                              title="View in Site"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Link
                    href={{
                      query: {
                        ...searchParams,
                        page: Math.max(1, currentPage - 1),
                      },
                    }}
                    className={`p-2 rounded-md border ${
                      currentPage === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    aria-disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Link>
                  <Link
                    href={{
                      query: {
                        ...searchParams,
                        page: Math.min(totalPages, currentPage + 1),
                      },
                    }}
                    className={`p-2 rounded-md border ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    aria-disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
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
              Manage your catalog efficiently. Use search to find specific items
              or export data for bulk updates.
            </p>
            <ul className="text-sm text-gray-600 space-y-2 list-none">
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 bg-blue-400 rounded-full mr-2"></div>
                <span>
                  <strong>ID Search:</strong> You can search by product ID as
                  well.
                </span>
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 bg-blue-400 rounded-full mr-2"></div>
                <span>
                  <strong>Pagination:</strong> Showing 10 products per page.
                </span>
              </li>
              <li className="flex items-center">
                <div className="h-1.5 w-1.5 bg-blue-400 rounded-full mr-2"></div>
                <span>
                  <strong>Bulk Ops:</strong> Updates are based on product ID.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
