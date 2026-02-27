"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  queryParams: Record<string, string | number | undefined>;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  queryParams,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const createUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined) {
        params.set(key, String(value));
      }
    });
    params.set("page", String(pageNumber));
    return `${baseUrl}?${params.toString()}`;
  };

  const pages = [];
  const maxVisiblePages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex justify-center items-center gap-2 mt-12 mb-8">
      <Link
        href={createUrl(Math.max(1, currentPage - 1))}
        className={`p-2.5 rounded-xl border transition-all duration-200 ${
          currentPage === 1
            ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
            : "bg-white text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-600 shadow-sm"
        }`}
        aria-disabled={currentPage === 1}
      >
        <ChevronLeft className="h-5 w-5" />
      </Link>

      {startPage > 1 && (
        <>
          <Link
            href={createUrl(1)}
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
          >
            1
          </Link>
          {startPage > 2 && <span className="text-gray-400 px-1">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={createUrl(page)}
          className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 shadow-sm ${
            currentPage === page
              ? "bg-blue-600 text-white border-blue-600"
              : "bg-white text-gray-700 border border-gray-200 hover:border-blue-500 hover:text-blue-600"
          }`}
        >
          {page}
        </Link>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && (
            <span className="text-gray-400 px-1">...</span>
          )}
          <Link
            href={createUrl(totalPages)}
            className="w-11 h-11 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm"
          >
            {totalPages}
          </Link>
        </>
      )}

      <Link
        href={createUrl(Math.min(totalPages, currentPage + 1))}
        className={`p-2.5 rounded-xl border transition-all duration-200 ${
          currentPage === totalPages
            ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
            : "bg-white text-gray-700 border-gray-200 hover:border-blue-500 hover:text-blue-600 shadow-sm"
        }`}
        aria-disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-5 w-5" />
      </Link>
    </nav>
  );
}
