"use client";

import { useState } from "react";
import { X, Save, Loader2, Plus, Trash2, GripVertical, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface LogoEntry {
    id: string;
    src: string;
    alt: string;
    href?: string;
}

interface ClientsSectionEditorProps {
    sectionId: string;
    content: {
        title?: string;
        logos?: string; // JSON string of LogoEntry[]
        bgColor?: string;
    };
    onClose: () => void;
    onSave: () => void;
}

export default function ClientsSectionEditor({
    sectionId,
    content,
    onClose,
    onSave,
}: ClientsSectionEditorProps) {
    const [title, setTitle] = useState(content.title ?? "Our Clients");
    const [bgColor, setBgColor] = useState(content.bgColor ?? "#f8fafc");
    const [isSaving, setIsSaving] = useState(false);

    // Parse initial logos
    const parseLogos = (): LogoEntry[] => {
        try {
            const parsed = content.logos ? JSON.parse(content.logos) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const [logos, setLogos] = useState<LogoEntry[]>(parseLogos);

    /* ── Handlers ── */

    const addLogo = () => {
        setLogos((prev) => [
            ...prev,
            { id: `logo-${Date.now()}`, src: "", alt: "", href: "" },
        ]);
    };

    const removeLogo = (id: string) => {
        setLogos((prev) => prev.filter((l) => l.id !== id));
    };

    const updateLogo = (id: string, field: keyof LogoEntry, value: string) => {
        setLogos((prev) =>
            prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updatedContent = {
                title,
                bgColor,
                logos: JSON.stringify(logos),
            };

            const res = await fetch(`/api/cms/sections/${sectionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: updatedContent }),
            });

            if (!res.ok) throw new Error("Failed to save");
            toast.success("Clients section updated!");
            onSave();
        } catch {
            toast.error("Error saving changes");
        } finally {
            setIsSaving(false);
        }
    };

    /* ── UI ── */

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[92vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Edit Clients Section</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Configure the logo ticker and heading</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* ── General settings ── */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                            <label className="text-sm font-semibold text-gray-700">Section Heading</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Our Clients"
                                className="w-full p-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1.5 col-span-2 sm:col-span-1">
                            <label className="text-sm font-semibold text-gray-700">Background Color</label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="color"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="w-10 h-10 border border-gray-300 rounded-lg cursor-pointer p-0.5"
                                />
                                <input
                                    type="text"
                                    value={bgColor}
                                    onChange={(e) => setBgColor(e.target.value)}
                                    className="flex-1 p-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* ── Logos list ── */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-gray-800">Client Logos</h3>
                                <p className="text-xs text-gray-500">{logos.length} logo{logos.length !== 1 ? "s" : ""} · paste a direct image URL</p>
                            </div>
                            <button
                                onClick={addLogo}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow"
                            >
                                <Plus className="h-4 w-4" />
                                Add Logo
                            </button>
                        </div>

                        {logos.length === 0 && (
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                                <ImageIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">No logos yet. Click "Add Logo" to get started.</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            {logos.map((logo, i) => (
                                <div
                                    key={logo.id}
                                    className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3 hover:border-blue-300 transition-colors"
                                >
                                    {/* Row header */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <GripVertical className="h-4 w-4 text-gray-300" />
                                            <span className="text-xs font-bold text-gray-500  tracking-wide">
                                                Logo {i + 1}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => removeLogo(logo.id)}
                                            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {/* Preview */}
                                    {logo.src && (
                                        <div className="flex justify-center bg-white border border-gray-100 rounded-lg p-2 h-14">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={logo.src}
                                                alt={logo.alt || "Logo preview"}
                                                className="h-full w-auto object-contain"
                                                onError={(e) => (e.currentTarget.style.display = "none")}
                                            />
                                        </div>
                                    )}

                                    {/* Fields */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                        <div className="space-y-1 sm:col-span-2">
                                            <label className="flex items-center gap-1 text-xs font-semibold text-gray-600">
                                                <ImageIcon className="h-3 w-3" />
                                                Image URL <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="url"
                                                value={logo.src}
                                                onChange={(e) => updateLogo(logo.id, "src", e.target.value)}
                                                placeholder="https://example.com/logo.png"
                                                className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-600">Company Name / Alt Text</label>
                                            <input
                                                type="text"
                                                value={logo.alt}
                                                onChange={(e) => updateLogo(logo.id, "alt", e.target.value)}
                                                placeholder="Acme Corp"
                                                className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="flex items-center gap-1 text-xs font-semibold text-gray-600">
                                                <LinkIcon className="h-3 w-3" />
                                                Website Link (optional)
                                            </label>
                                            <input
                                                type="url"
                                                value={logo.href ?? ""}
                                                onChange={(e) => updateLogo(logo.id, "href", e.target.value)}
                                                placeholder="https://acme.com"
                                                className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-end gap-3 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                    >
                        {isSaving ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                        ) : (
                            <><Save className="h-4 w-4" /> Save Changes</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
