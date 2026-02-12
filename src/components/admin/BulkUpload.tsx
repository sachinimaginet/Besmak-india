"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

export default function BulkUpload() {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("Processing...");

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);

        console.log("Parsed Excel Data:", data);

        // Here you would call a Server Action or API to save 'data' to DB
        // await bulkCreateProducts(data);

        setMessage(
          `Successfully parsed ${data.length} rows. (DB saving disabled in demo)`,
        );
      } catch (err) {
        console.error(err);
        setMessage("Error parsing file.");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="font-bold mb-2">Bulk Upload Products</h3>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        disabled={uploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      {message && <p className="mt-2 text-sm text-gray-700">{message}</p>}
    </div>
  );
}
