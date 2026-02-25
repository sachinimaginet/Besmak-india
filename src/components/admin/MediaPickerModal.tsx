"use client";

import { useState, useEffect, useCallback } from "react";
import {
  X,
  Upload,
  Loader2,
  Check,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  contentType: string;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (urls: string[]) => void;
  selectedUrls: string[];
  multiple?: boolean;
}

export default function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  selectedUrls,
  multiple = true,
}: MediaPickerModalProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [tempSelected, setTempSelected] = useState<string[]>(selectedUrls);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchMedia = useCallback(async (pageNum: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/media?page=${pageNum}&limit=12`);
      if (!res.ok) throw new Error("Failed to fetch media");
      const data = await res.json();
      setMedia(data.media);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching media:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchMedia(page);
      setTempSelected(selectedUrls);
    }
  }, [isOpen, page, fetchMedia, selectedUrls]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const res = await fetch(
        `/api/upload?filename=${encodeURIComponent(file.name)}`,
        {
          method: "POST",
          body: file,
        },
      );

      if (!res.ok) throw new Error("Upload failed");
      const blob = await res.json();

      // Add new upload to selection
      if (multiple) {
        setTempSelected((prev) => [...prev, blob.url]);
      } else {
        setTempSelected([blob.url]);
      }

      await fetchMedia(1);
      setPage(1);
    } catch (err) {
      alert("Upload failed: " + (err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const toggleSelect = (url: string) => {
    if (multiple) {
      setTempSelected((prev) =>
        prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url],
      );
    } else {
      setTempSelected([url]);
    }
  };

  const handleConfirm = () => {
    onSelect(tempSelected);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative z-10 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Select Media</h2>
          <div className="flex gap-2">
            <label className="flex items-center gap-2 bg-blue-600 text-white px-3 py-1.5 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors text-sm font-medium">
              <Upload className="h-4 w-4" />
              <span>{uploading ? "Uploading..." : "Upload New"}</span>
              <input
                type="file"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
                accept="image/*"
              />
            </label>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : media.length === 0 ? (
            <div className="text-center py-20">
              <Upload className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No media found. Upload something!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {media.map((item) => {
                const isSelected = tempSelected.includes(item.url);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSelect(item.url)}
                    className={`relative aspect-square rounded-lg border-2 cursor-pointer overflow-hidden transition-all ${
                      isSelected
                        ? "border-blue-500 ring-2 ring-blue-200"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <Image
                      src={item.url}
                      alt={item.filename}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 15vw"
                    />
                    {isSelected && (
                      <div className="absolute top-1 right-1 bg-blue-500 text-white rounded-full p-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg hover:bg-gray-200 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
          <div className="flex gap-3">
            <span className="text-sm text-gray-500 flex items-center mr-2">
              {tempSelected.length} item(s) selected
            </span>
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
