"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import {
  Download,
  Upload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Lock,
} from "lucide-react";
import PasswordModal from "./PasswordModal";

export default function BulkUpload() {
  const [working, setWorking] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error" | "info";
    message: string;
  } | null>(null);

  // Security Verification State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: "export" | "upload";
    data?: any;
  } | null>(null);

  const triggerExport = () => {
    setPendingAction({ type: "export" });
    setIsPasswordModalOpen(true);
  };

  const exportProducts = async () => {
    try {
      setWorking(true);
      setStatus({ type: "info", message: "Fetching product data..." });

      const res = await fetch("/api/product");
      if (!res.ok) throw new Error("Failed to fetch products for export");

      const products = await res.json();

      // Prepare data for Excel - ensure all columns exist
      const excelData = products.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description || "",
        categoryId: p.categoryId || "",
        categoryName: p.categoryName || "",
        categorySpecification: p.categorySpecification || "",
        images:
          typeof p.images === "string"
            ? p.images
            : JSON.stringify(p.images || []),
        specifications:
          typeof p.specifications === "string"
            ? p.specifications
            : JSON.stringify(p.specifications || {}),
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));

      const worksheet = XLSX.utils.json_to_sheet(excelData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

      XLSX.writeFile(
        workbook,
        `products_export_${new Date().toISOString().split("T")[0]}.xlsx`,
      );

      setStatus({ type: "success", message: "Export completed successfully!" });
    } catch (err) {
      console.error(err);
      setStatus({ type: "error", message: (err as Error).message });
    } finally {
      setWorking(false);
    }
  };

  const handleFileUploadRequest = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPendingAction({ type: "upload", data: file });
    setIsPasswordModalOpen(true);
    // Reset input so the same file can be selected again if needed
    e.target.value = "";
  };

  const handleFileUpload = async (file: File) => {
    setWorking(true);
    setStatus({ type: "info", message: "Uploading and processing file..." });

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        if (data.length === 0) {
          throw new Error("The Excel file is empty.");
        }

        const res = await fetch("/api/bulk-products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ products: data }),
        });

        const result = await res.json();

        if (!res.ok) throw new Error(result.error || "Bulk upload failed");

        setStatus({
          type: "success",
          message: result.message,
        });

        // Refresh page to show new data after a delay
        setTimeout(() => window.location.reload(), 2000);
      } catch (err) {
        console.error(err);
        setStatus({ type: "error", message: (err as Error).message });
      } finally {
        setWorking(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const handlePasswordSuccess = () => {
    if (!pendingAction) return;

    if (pendingAction.type === "export") {
      exportProducts();
    } else if (pendingAction.type === "upload" && pendingAction.data) {
      handleFileUpload(pendingAction.data);
    }
    setPendingAction(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <Upload className="h-5 w-5 text-primary" />
        Bulk Operations
      </h3>

      <div className="space-y-4">
        {/* Export Button */}
        <div>
          <button
            onClick={triggerExport}
            disabled={working}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-400 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors font-medium disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export Products to Excel
          </button>
        </div>

        <div className="relative">
          <div className="relative flex justify-center text-xs uppercase text-gray-400">
            <span className="bg-white px-2 italic">
              Careful: Uploading will clear existing catalog
            </span>
          </div>
        </div>

        {/* Warning Message */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs text-amber-800 leading-relaxed">
            <strong>Overwrite Mode:</strong> Uploading a file will delete{" "}
            <span className="font-bold underline">all current products</span>.
            Ensure your file contains the full catalog.
          </p>
        </div>

        {/* Import Input */}
        <div className="border-2 border-dashed border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
          <label className="cursor-pointer">
            <div className="flex flex-col items-center justify-center py-2 text-gray-500">
              <Upload className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm font-medium">Click to upload Excel file</p>
              <p className="text-xs mt-1 text-gray-400">
                .xlsx or .xls files only
              </p>
            </div>
            <input
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileUploadRequest}
              disabled={working}
              className="hidden"
            />
          </label>
        </div>

        {/* Status Message */}
        {status && (
          <div
            className={`flex items-start gap-3 p-3 rounded-lg text-sm ${
              status.type === "success"
                ? "bg-green-50 text-green-700 border border-green-100"
                : status.type === "error"
                  ? "bg-red-50 text-red-700 border border-red-100"
                  : "bg-primary/5 text-primary border border-primary/10"
            }`}
          >
            {working ? (
              <Loader2 className="h-4 w-4 mt-0.5 animate-spin" />
            ) : status.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 mt-0.5 text-red-600" />
            )}
            <span>{status.message}</span>
          </div>
        )}
      </div>
      <PasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setPendingAction(null);
        }}
        onSuccess={handlePasswordSuccess}
        title={
          pendingAction?.type === "export"
            ? "Confirm Export"
            : "Confirm Overwrite"
        }
        description={
          pendingAction?.type === "export"
            ? "Re-verify your password to export the product catalog to Excel."
            : "ATTENTION: This will delete ALL current products and replace them with your new file. Re-verify your password to proceed."
        }
      />
    </div>
  );
}
