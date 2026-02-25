"use client";

import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DeleteCategoryButton({
  categoryId,
  categoryName,
}: {
  categoryId: string;
  categoryName: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete "${categoryName}"? Products in this category will be marked as uncategorized.`,
      )
    )
      return;

    setLoading(true);
    try {
      const res = await fetch(`/api/category?id=${categoryId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete category");

      router.refresh();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:text-red-900 p-1 disabled:opacity-50"
      title="Delete"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}
