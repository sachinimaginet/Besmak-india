import { query as dbQuery } from "@/lib/db";
import Link from "next/link";

export default async function DashboardPage() {
  // Fetch real stats
  const [productsCount, enquiriesCount, mediaCount] = await Promise.all([
    dbQuery<any[]>("SELECT COUNT(*) as count FROM product"),
    dbQuery<any[]>("SELECT COUNT(*) as count FROM enquiry"),
    dbQuery<any[]>("SELECT COUNT(*) as count FROM media"),
  ]);

  const stats = {
    totalProducts: productsCount[0]?.count || 0,
    totalEnquiries: enquiriesCount[0]?.count || 0,
    totalMedia: mediaCount[0]?.count || 0,
  };

  const recentActivity = [
    "System migration to MySQL completed",
    "Prisma dependencies removed",
    "Media management system initialized",
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/products"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <h3 className="text-gray-500 font-medium text-sm uppercase group-hover:text-blue-600">
            Total Products
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats.totalProducts}
          </p>
        </Link>
        <Link
          href="/admin/enquiries"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <h3 className="text-gray-500 font-medium text-sm uppercase group-hover:text-blue-600">
            Total Enquiries
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats.totalEnquiries}
          </p>
        </Link>
        <Link
          href="/admin/media"
          className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
        >
          <h3 className="text-gray-500 font-medium text-sm uppercase group-hover:text-blue-600">
            Media Files
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {stats.totalMedia}
          </p>
        </Link>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Recent Activity
        </h2>
        <ul className="divide-y divide-gray-100">
          {recentActivity.map((activity, index) => (
            <li key={index} className="py-3 text-gray-600">
              {activity}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
