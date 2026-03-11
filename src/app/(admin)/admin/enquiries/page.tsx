import { query as dbQuery } from "@/lib/db";
import { Mail } from "lucide-react";
import EnquiryList from "@/components/admin/EnquiryList";

export default async function AdminEnquiriesPage() {
  // Fetch all products for name mapping in bulk enquiries
  const products = await dbQuery<{ id: string; name: string }[]>(
    "SELECT id, name FROM product",
  );
  const productMap = products.reduce((acc: any, p) => {
    acc[p.id] = p.name;
    return acc;
  }, {});

  const sql = `
    SELECT e.*, p.name as productName 
    FROM enquiry e 
    LEFT JOIN product p ON e.productId = p.id 
    ORDER BY e.createdAt DESC
  `;

  const rawEnquiries = await dbQuery<any[]>(sql);

  // Map bulk enquiry messages to include actual product names instead of just IDs
  const enquiries = rawEnquiries.map((enq) => {
    let message = enq.message || "";
    if (message.includes("--- Bulk Enquiry ---")) {
      const match = message.match(/Products IDs: (.*)/);
      if (match) {
        const ids = match[1].split(",").map((id: string) => id.trim());
        const names = ids.map((id: string) => productMap[id] || id);
        message = message.replace(
          `Products IDs: ${match[1]}`,
          `Products: ${names.join(", ")}`,
        );
      }
    }
    return { ...enq, message };
  });

  return (
    <div className="p-6">
      <h1 className="text-3xl font-black text-gray-900 mb-8 flex items-center gap-3">
        <Mail className="w-8 h-8 text-primary" />
        Customer Enquiries
      </h1>

      <EnquiryList initialEnquiries={enquiries} />
    </div>
  );
}
