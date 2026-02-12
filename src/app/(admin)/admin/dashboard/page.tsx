import { DUMMY_PRODUCTS } from "@/lib/dummy-data";

export default function DashboardPage() {
  // Mock stats
  const totalProducts = DUMMY_PRODUCTS.length;
  const totalEnquiries = 12; // Mock
  const recentActivity = [
    "New enquiry from John Doe",
    "Product 'Valve X100' updated",
    "New product 'Gear G300' added",
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 font-medium text-sm uppercase">
            Total Products
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {totalProducts}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 font-medium text-sm uppercase">
            Total Enquiries
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">
            {totalEnquiries}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-gray-500 font-medium text-sm uppercase">
            Pending Orders
          </h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">5</p>
        </div>
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
