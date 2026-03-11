"use client";

import { useState } from "react";
import {
  Factory,
  Laptop,
  Mail,
  Phone,
  Building2,
  Briefcase,
  X,
  Eye,
  CheckCircle2,
  Clock,
  Loader2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  productId?: string;
  productName?: string;
  status: "PENDING" | "COMPLETED";
  createdAt: string;
}

interface EnquiryListProps {
  initialEnquiries: Enquiry[];
}

export default function EnquiryList({ initialEnquiries }: EnquiryListProps) {
  const [enquiries, setEnquiries] = useState(initialEnquiries);
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  const handleStatusToggle = async (e: React.MouseEvent, enquiry: Enquiry) => {
    e.stopPropagation();
    const newStatus = enquiry.status === "PENDING" ? "COMPLETED" : "PENDING";
    setIsUpdating(enquiry.id);

    try {
      const resp = await fetch(`/api/enquiry/${enquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!resp.ok) throw new Error("Failed to update status");

      setEnquiries((prev) =>
        prev.map((enq) =>
          enq.id === enquiry.id ? { ...enq, status: newStatus } : enq,
        ),
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setIsUpdating(null);
    }
  };

  const parseBulkProductIds = (message: string) => {
    const match = message.match(/Products IDs: (.*)/);
    if (!match) return [];
    return match[1].split(",").map((id) => id.trim());
  };

  return (
    <div className="bg-white rounded-3xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                Inquiry Date
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                Customer Details
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                Contact Info
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                Company / Industry
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                Product / Interest
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                Status
              </th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {enquiries.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-20 text-center text-gray-400 font-bold italic"
                >
                  No enquiries found in the database.
                </td>
              </tr>
            ) : (
              enquiries.map((enquiry) => {
                const isBulk =
                  enquiry.message &&
                  enquiry.message.includes("--- Bulk Enquiry ---");

                return (
                  <tr
                    key={enquiry.id}
                    onClick={() => setSelectedEnquiry(enquiry)}
                    className="hover:bg-gray-50/80 transition-all group cursor-pointer"
                  >
                    <td
                      className="px-6 py-5 whitespace-nowrap text-[12px] font-bold text-gray-500"
                      suppressHydrationWarning
                    >
                      {new Date(enquiry.createdAt).toLocaleDateString(
                        undefined,
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        },
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm font-black text-gray-900 group-hover:text-primary transition-colors">
                        {enquiry.name}
                      </div>
                      <div className="text-[11px] font-bold text-gray-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3" />
                        {enquiry.email}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {enquiry.phone ? (
                        <div className="text-[12px] font-black text-gray-700 flex items-center gap-1.5">
                          <span className="w-6 h-6 bg-blue-50 text-blue-500 rounded-lg flex items-center justify-center shrink-0">
                            <Phone className="w-3 h-3" />
                          </span>
                          {enquiry.phone}
                        </div>
                      ) : (
                        <span className="text-[10px] text-gray-300 font-bold uppercase tracking-widest italic">
                          N/A
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex flex-col gap-1.5">
                        <div className="text-[11px] font-black text-gray-700 flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-gray-400" />
                          {enquiry.message?.match(/Company: (.*)/)?.[1] ||
                            "N/A"}
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 uppercase tracking-tighter">
                          <Briefcase className="w-3 h-3" />
                          {enquiry.message?.match(/Industry: (.*)/)?.[1] ||
                            "N/A"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {isBulk ? (
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                          <Laptop className="w-3 h-3" />
                          Bulk Inquiry
                        </div>
                      ) : (
                        <div className="text-[12px] font-bold text-gray-900 flex items-center gap-2">
                          <div className="w-7 h-7 bg-primary/5 rounded-lg flex items-center justify-center text-primary shrink-0">
                            <Factory className="w-3.5 h-3.5" />
                          </div>
                          <span className="truncate max-w-[150px]">
                            {enquiry.productName || "General Query"}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <button
                        disabled={isUpdating === enquiry.id}
                        onClick={(e) => handleStatusToggle(e, enquiry)}
                        className={`px-3 py-1.5 inline-flex items-center gap-2 text-[10px] font-black rounded-full uppercase tracking-widest transition-all ${
                          enquiry.status === "PENDING"
                            ? "bg-amber-50 text-amber-600 border border-amber-100 hover:bg-amber-100"
                            : "bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100"
                        }`}
                      >
                        {isUpdating === enquiry.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : enquiry.status === "PENDING" ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <CheckCircle2 className="w-3 h-3" />
                        )}
                        {enquiry.status}
                      </button>
                    </td>
                    <td className="px-6 py-5 text-right whitespace-nowrap">
                      <button className="p-2 text-gray-400 hover:text-primary transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {selectedEnquiry && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEnquiry(null)}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden overflow-y-auto max-h-[90vh]"
            >
              <div className="p-6 md:p-10">
                <div className="flex items-center justify-between mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-widest">
                    Inquiry Details
                  </div>
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                        Customer Name
                      </h4>
                      <p className="text-lg font-black text-gray-900">
                        {selectedEnquiry.name}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                        Email Address
                      </h4>
                      <p className="text-sm font-bold text-gray-700">
                        {selectedEnquiry.email}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                        Phone Number
                      </h4>
                      <p className="text-sm font-bold text-gray-700">
                        {selectedEnquiry.phone || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                        Company Name
                      </h4>
                      <p className="text-sm font-bold text-gray-900">
                        {selectedEnquiry.message?.match(/Company: (.*)/)?.[1] ||
                          "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                        Industry Sector
                      </h4>
                      <p className="text-sm font-bold text-gray-900 italic">
                        {selectedEnquiry.message?.match(
                          /Industry: (.*)/,
                        )?.[1] || "N/A"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                        Submission Date
                      </h4>
                      <p className="text-sm font-bold text-gray-900">
                        {new Date(selectedEnquiry.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">
                    Product Interest
                  </h4>
                  {selectedEnquiry.message?.includes("--- Bulk Enquiry ---") ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[12px] font-black text-amber-600 mb-3 bg-amber-50 px-3 py-1.5 rounded-lg w-fit">
                        <Laptop className="w-4 h-4" />
                        Multi-Product Inquiry
                      </div>
                      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                        <p className="text-[11px] font-bold text-gray-600 italic">
                          {selectedEnquiry.message?.match(
                            /Products: (.*)/,
                          )?.[1] ||
                            selectedEnquiry.message?.match(
                              /Products IDs: (.*)/,
                            )?.[1] ||
                            "N/A"}
                        </p>
                        <p className="mt-2 text-[10px] text-gray-400 font-bold">
                          * The selected products are listed above.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-100 group hover:border-primary/20 transition-all">
                      <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-all">
                        <Factory className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-black text-gray-900">
                        {selectedEnquiry.productName || "General Inquiry"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
                    Customer Message
                  </h4>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 text-sm font-medium text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {selectedEnquiry.message
                      ?.split("--- Additional Info ---")[0]
                      .trim()}
                  </div>
                </div>

                <div className="mt-10 flex gap-4">
                  <button
                    onClick={(e) => {
                      handleStatusToggle(e, selectedEnquiry);
                      setSelectedEnquiry((prev) =>
                        prev
                          ? {
                              ...prev,
                              status:
                                prev.status === "PENDING"
                                  ? "COMPLETED"
                                  : "PENDING",
                            }
                          : null,
                      );
                    }}
                    className={`flex-1 py-4 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all ${
                      selectedEnquiry.status === "PENDING"
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25 hover:bg-emerald-600"
                        : "bg-amber-500 text-white shadow-lg shadow-amber-500/25 hover:bg-amber-600"
                    }`}
                  >
                    Mark as{" "}
                    {selectedEnquiry.status === "PENDING"
                      ? "Completed"
                      : "Pending"}
                  </button>
                  <button
                    onClick={() => setSelectedEnquiry(null)}
                    className="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-gray-200 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
