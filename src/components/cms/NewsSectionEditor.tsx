"use client";

import { useState } from "react";
import { X, Save, Loader2, Plus, Trash2, Link as LinkIcon, Image as ImageIcon, Type, Calendar } from "lucide-react";
import { toast } from "sonner";

interface NewsItem {
    title: string;
    description?: string;
    link: string;
}

interface NewsImage {
    url: string;
    title: string;
    date?: string;
}

interface NewsSectionEditorProps {
    sectionId: string;
    content: {
        title?: string;
        newsItems?: NewsItem[];
        featuredBoxText?: string;
        images?: NewsImage[];
    };
    onClose: () => void;
    onSave: () => void;
}

export default function NewsSectionEditor({
    sectionId,
    content,
    onClose,
    onSave,
}: NewsSectionEditorProps) {
    const [title, setTitle] = useState(content.title || "Key Highlights of Besmak");
    const [newsItems, setNewsItems] = useState<NewsItem[]>(content.newsItems || []);
    const [featuredBoxText, setFeaturedBoxText] = useState(content.featuredBoxText || "");
    const [images, setImages] = useState<NewsImage[]>(content.images || Array(4).fill({ url: "", title: "", date: "" }));
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`/api/cms/sections/${sectionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: {
                        ...content,
                        title,
                        newsItems,
                        featuredBoxText,
                        images,
                    },
                }),
            });

            if (!response.ok) throw new Error("Failed to save changes");

            toast.success("News section updated successfully");
            onSave();
        } catch (error) {
            console.error(error);
            toast.error("Error saving changes");
        } finally {
            setIsSaving(false);
        }
    };

    const addNewsItem = () => {
        setNewsItems([...newsItems, { title: "", description: "", link: "#" }]);
    };

    const removeNewsItem = (index: number) => {
        setNewsItems(newsItems.filter((_, i) => i !== index));
    };

    const updateNewsItem = (index: number, field: keyof NewsItem, value: string) => {
        const newItems = [...newsItems];
        newItems[index] = { ...newItems[index], [field]: value };
        setNewsItems(newItems);
    };

    const updateImage = (index: number, field: keyof NewsImage, value: string) => {
        const newImages = [...images];
        newImages[index] = { ...newImages[index], [field]: value };
        setImages(newImages);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-gray-900">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b flex items-center justify-between bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800 tracking-wide">
                        Edit News Section
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto space-y-8">
                    {/* Basic Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-500 uppercase tracking-wider">Featured Box Text</label>
                            <textarea
                                value={featuredBoxText}
                                onChange={(e) => setFeaturedBoxText(e.target.value)}
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm min-h-[100px]"
                                placeholder="Latest highlight..."
                            />
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* News Items */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">News List Items</h3>
                            <button
                                onClick={addNewsItem}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-semibold text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add News Item
                            </button>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {newsItems.map((item, index) => (
                                <div key={index} className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 relative group flex flex-col gap-4">
                                    <button
                                        onClick={() => removeNewsItem(index)}
                                        className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                                                <Type className="w-3 h-3" /> Title
                                            </label>
                                            <input
                                                type="text"
                                                value={item.title}
                                                onChange={(e) => updateNewsItem(index, "title", e.target.value)}
                                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                                                <LinkIcon className="w-3 h-3" /> Link
                                            </label>
                                            <input
                                                type="text"
                                                value={item.link}
                                                onChange={(e) => updateNewsItem(index, "link", e.target.value)}
                                                className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                                            <Type className="w-3 h-3" /> Description
                                        </label>
                                        <textarea
                                            value={item.description}
                                            onChange={(e) => updateNewsItem(index, "description", e.target.value)}
                                            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg text-sm min-h-[80px]"
                                            placeholder="Item description..."
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Collage Images */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-gray-900">Collage Images (4 total)</h3>
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            {images.map((image, index) => (
                                <div key={index} className="p-3 md:p-5 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">Img {index + 1}</span>
                                    </div>
                                    <div className="space-y-3">
                                        {/* Preview */}
                                        <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden border border-gray-100">
                                            {image.url ? (
                                                <img
                                                    src={image.url}
                                                    alt="preview"
                                                    className="w-full h-full object-contain"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-gray-400">
                                                    <ImageIcon className="w-5 h-5" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <div className="space-y-1">
                                                <label className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase"><ImageIcon className="w-3 h-3" /> URL</label>
                                                <input
                                                    type="text"
                                                    value={image.url}
                                                    onChange={(e) => updateImage(index, "url", e.target.value)}
                                                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                                                    placeholder="URL..."
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="flex items-center gap-2 text-[9px] font-bold text-gray-500 uppercase"><Type className="w-3 h-3" /> Title</label>
                                                <input
                                                    type="text"
                                                    value={image.title}
                                                    onChange={(e) => updateImage(index, "title", e.target.value)}
                                                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-xs"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center shadow-lg shadow-blue-200 transition-all active:scale-95"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-5 w-5" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
