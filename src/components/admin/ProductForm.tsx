"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, X, Image as ImageIcon } from "lucide-react";
import MediaPickerModal from "./MediaPickerModal";
import Image from "next/image";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function ProductForm({
  initialData,
  isEdit = false,
}: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: initialData?.id || "",
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    categoryId: initialData?.categoryId || "",
    categorySpecification: initialData?.categorySpecification || "",
    images: initialData?.images
      ? typeof initialData.images === "string"
        ? JSON.parse(initialData.images)
        : initialData.images
      : [],
    specifications: initialData?.specifications
      ? typeof initialData.specifications === "string"
        ? JSON.parse(initialData.specifications)
        : initialData.specifications
      : {},
  });

  useEffect(() => {
    // Fetch categories for dropdown
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/category"); // Need to ensure this exists or use a direct db call in parent
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEdit && formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/product", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData.error ||
            (isEdit ? "Failed to update product" : "Failed to create product"),
        );
      }

      toast.success(
        isEdit
          ? "Product updated successfully!"
          : "Product created successfully!",
      );
      router.push("/admin/products");
      router.refresh();
    } catch (error: any) {
      console.error("Form error:", error);
      toast.error(
        error.message || "An unexpected error occurred. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Product Details */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {isEdit ? "Edit Product Details" : "New Product Details"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border text-gray-900"
              placeholder="e.g. High Pressure Centrifugal Pump"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              URL Slug *
            </label>
            <input
              type="text"
              required
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value })
              }
              className="w-full border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border bg-gray-50 text-gray-900"
              placeholder="high-pressure-pump"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({ ...formData, categoryId: e.target.value })
              }
              className="w-full border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border text-gray-900"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Specification */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category Number / Specification
            </label>
            <input
              type="text"
              value={formData.categorySpecification}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categorySpecification: e.target.value,
                })
              }
              className="w-full border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border text-gray-900"
              placeholder="e.g. CAT-001 or 12345"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2.5 border text-gray-900"
              placeholder="Enter product description..."
            />
          </div>
        </div>
      </div>

      {/* Product Images */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Product Images</h2>
          <button
            type="button"
            onClick={() => setIsMediaPickerOpen(true)}
            className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium border border-blue-100 flex items-center gap-2"
          >
            <ImageIcon className="h-4 w-4" />
            Manage Images
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {formData.images.length === 0 ? (
            <div className="col-span-full py-10 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400">
              <ImageIcon className="h-10 w-10 mb-2 opacity-20" />
              <p className="text-sm">No images selected</p>
            </div>
          ) : (
            formData.images.map((url: string, index: number) => (
              <div
                key={index}
                className="group relative aspect-square rounded-lg border border-gray-200 overflow-hidden shadow-sm"
              >
                <Image
                  src={url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 20vw"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newImages = [...formData.images];
                    newImages.splice(index, 1);
                    setFormData({ ...formData, images: newImages });
                  }}
                  className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Technical Specifications
          </h2>
          <button
            type="button"
            onClick={() => {
              const newKey = `Property ${Object.keys(formData.specifications).length + 1}`;
              setFormData({
                ...formData,
                specifications: {
                  ...formData.specifications,
                  [newKey]: "",
                },
              });
            }}
            className="text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors font-medium border border-blue-100"
          >
            + Add Specification
          </button>
        </div>

        <div className="space-y-4">
          {Object.entries(formData.specifications).length === 0 ? (
            <p className="text-gray-500 text-sm italic text-center py-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              No specifications added yet. Click the button above to add some.
            </p>
          ) : (
            Object.entries(formData.specifications).map(
              ([key, value], index) => (
                <div key={index} className="flex gap-4 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={key}
                      onChange={(e) => {
                        const newKey = e.target.value;
                        const newSpecs = { ...formData.specifications };
                        // If key changed, we need to create a new key and delete old one
                        if (newKey !== key) {
                          newSpecs[newKey] = value;
                          delete newSpecs[key];
                          setFormData({
                            ...formData,
                            specifications: newSpecs,
                          });
                        }
                      }}
                      className="w-full border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border text-sm font-medium text-gray-900"
                      placeholder="Property Name (e.g. Weight)"
                    />
                  </div>
                  <div className="flex-2">
                    <input
                      type="text"
                      value={String(value)}
                      onChange={(e) => {
                        setFormData({
                          ...formData,
                          specifications: {
                            ...formData.specifications,
                            [key]: e.target.value,
                          },
                        });
                      }}
                      className="w-full border-gray-400 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 p-2 border text-sm text-gray-900"
                      placeholder="Value (e.g. 50kg)"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newSpecs = { ...formData.specifications };
                      delete newSpecs[key];
                      setFormData({ ...formData, specifications: newSpecs });
                    }}
                    className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors border border-transparent hover:border-red-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ),
            )
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {isEdit ? "Update Product" : "Create Product"}
        </button>
      </div>

      <MediaPickerModal
        isOpen={isMediaPickerOpen}
        onClose={() => setIsMediaPickerOpen(false)}
        selectedUrls={formData.images}
        onSelect={(urls) => setFormData({ ...formData, images: urls })}
      />
    </form>
  );
}
