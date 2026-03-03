"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Globe,
  Settings,
  Save,
  X,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";

export default function PagesAdmin() {
  const [pages, setPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch("/api/admin/pages");
      const data = await response.json();
      setPages(data);
    } catch (error) {
      toast.error("Failed to load pages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    // Ensure slug is included even if the input was disabled (for home page)
    if (editingPage && !data.slug) {
      data.slug = editingPage.slug;
    }

    try {
      const url = editingPage
        ? `/api/admin/pages/${editingPage.id}`
        : "/api/admin/pages";
      const method = editingPage ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          isActive: formData.get("isActive") === "on",
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to save page");
      }

      toast.success(editingPage ? "Page updated" : "Page created");
      setIsModalOpen(false);
      setEditingPage(null);
      fetchPages();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, slug: string) => {
    if (slug === "home") {
      toast.error("Cannot delete home page");
      return;
    }
    if (!confirm("Are you sure? All sections on this page will be deleted."))
      return;

    try {
      const response = await fetch(`/api/admin/pages/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        toast.success("Page deleted");
        fetchPages();
      } else {
        const err = await response.json();
        throw new Error(err.error);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const filteredPages = pages.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            Page Management
            <span className="text-sm font-normal bg-gray-100 text-gray-500 px-2 py-1 rounded-full">
              {pages.length} Total
            </span>
          </h1>
          <p className="text-gray-600">
            Manage site structure and SEO metadata.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingPage(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors shadow-lg"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create New Page
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b flex items-center bg-gray-50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search pages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-4 font-semibold">Page Details</th>
                <th className="px-6 py-4 font-semibold">SEO Info</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="text-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-500" />
                  </td>
                </tr>
              ) : filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-500">
                    No pages found.
                  </td>
                </tr>
              ) : (
                filteredPages.map((page) => (
                  <tr
                    key={page.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-800">
                        {page.title}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Globe className="h-3 w-3 mr-1" />/{page.slug}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-700 max-w-xs truncate">
                        {page.description || "No description set"}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 capitalize">
                        {page.keywords?.split(",").slice(0, 3).join(", ") ||
                          "No keywords"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          page.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {page.isActive ? "Active" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={page.slug === "home" ? "/" : `/${page.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Live Page"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                        <button
                          onClick={() => {
                            setEditingPage(page);
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Page"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(page.id, page.slug)}
                          className={`p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${page.slug === "home" ? "invisible" : ""}`}
                          title="Delete Page"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex items-center justify-between bg-gray-50">
              <h2 className="text-xl font-bold text-gray-800">
                {editingPage ? "Edit Page" : "Add New Page"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 overflow-y-auto space-y-4"
            >
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">
                  Display Title
                </label>
                <input
                  name="title"
                  defaultValue={editingPage?.title}
                  required
                  placeholder="e.g. Services"
                  className="w-full p-2.5 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">
                  Slug (URL path)
                </label>
                <input
                  name="slug"
                  defaultValue={editingPage?.slug}
                  required
                  disabled={editingPage?.slug === "home"}
                  placeholder="e.g. services"
                  className="w-full p-2.5 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-50 disabled:text-gray-500"
                />
              </div>

              <div className="space-y-1 pt-2 border-t">
                <label className="text-sm font-bold text-gray-800 flex items-center">
                  <Settings className="h-4 w-4 mr-1 text-blue-500" />
                  SEO Metadata
                </label>
                <div className="space-y-3 mt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Meta Description
                    </label>
                    <textarea
                      name="description"
                      defaultValue={editingPage?.description}
                      placeholder="Summary for search engines..."
                      className="w-full p-2.5 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-20 placeholder:text-gray-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-500 uppercase">
                      Keywords (comma separated)
                    </label>
                    <input
                      name="keywords"
                      defaultValue={editingPage?.keywords}
                      placeholder="industrial, components, delhi"
                      className="w-full p-2.5 border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editingPage ? editingPage.isActive : true}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Publish Page
                </span>
              </label>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center shadow-lg shadow-blue-100"
                >
                  {isSaving && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {editingPage ? "Update Page" : "Create Page"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
