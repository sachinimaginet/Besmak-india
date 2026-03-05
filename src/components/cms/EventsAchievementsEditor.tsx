"use client";

import { useState } from "react";
import { X, Save, Loader2, Plus, Trash2, GripVertical, Image as ImageIcon, Link as LinkIcon, Type } from "lucide-react";
import { toast } from "sonner";

interface EventEntry {
    id: string;
    image: string;
    alt: string;
    href?: string;
}

interface EventsAchievementsEditorProps {
    sectionId: string;
    content: {
        caption?: string;
        title?: string;
        description?: string;
        events?: string; // JSON string of EventEntry[]
    };
    onClose: () => void;
    onSave: () => void;
}

export default function EventsAchievementsEditor({
    sectionId,
    content,
    onClose,
    onSave,
}: EventsAchievementsEditorProps) {
    const [caption, setCaption] = useState(content.caption ?? "COMPANY MILESTONES");
    const [title, setTitle] = useState(content.title ?? "Events & Achievements");
    const [description, setDescription] = useState(content.description ?? "");
    const [isSaving, setIsSaving] = useState(false);

    // Parse initial events
    const parseEvents = (): EventEntry[] => {
        try {
            const parsed = content.events ? JSON.parse(content.events) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const [events, setEvents] = useState<EventEntry[]>(parseEvents);

    /* ── Handlers ── */

    const addEvent = () => {
        setEvents((prev) => [
            ...prev,
            { id: `event-${Date.now()}`, image: "", alt: "", href: "" },
        ]);
    };

    const removeEvent = (id: string) => {
        setEvents((prev) => prev.filter((e) => e.id !== id));
    };

    const updateEvent = (id: string, field: keyof EventEntry, value: string) => {
        setEvents((prev) =>
            prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
        );
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updatedContent = {
                caption,
                title,
                description,
                events: JSON.stringify(events),
            };

            const res = await fetch(`/api/cms/sections/${sectionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: updatedContent }),
            });

            if (!res.ok) throw new Error("Failed to save");
            toast.success("Events & Achievements updated!");
            onSave();
        } catch {
            toast.error("Error saving changes");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden max-h-[92vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Edit Events & Achievements</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Configure the slider and header content</p>
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

                    {/* ── Text settings ── */}
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Small Caption</label>
                            <input
                                type="text"
                                value={caption}
                                onChange={(e) => setCaption(e.target.value)}
                                placeholder="COMPANY MILESTONES"
                                className="w-full p-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Main Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Events & Achievements"
                                className="w-full p-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter section description..."
                                className="w-full p-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
                            />
                        </div>
                    </div>

                    {/* ── Events list ── */}
                    <div className="space-y-3 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-gray-800">Event Cards</h3>
                                <p className="text-xs text-gray-500">{events.length} card{events.length !== 1 ? "s" : ""} · upload poster images</p>
                            </div>
                            <button
                                onClick={addEvent}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow"
                            >
                                <Plus className="h-4 w-4" />
                                Add Card
                            </button>
                        </div>

                        {events.length === 0 && (
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
                                <ImageIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                                <p className="text-sm text-gray-400">No events yet. Click "Add Card" to get started.</p>
                            </div>
                        )}

                        <div className="space-y-3">
                            {events.map((event, i) => (
                                <div
                                    key={event.id}
                                    className="border border-gray-200 rounded-xl p-4 bg-gray-50 space-y-3 hover:border-blue-300 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <GripVertical className="h-4 w-4 text-gray-300" />
                                            <span className="text-xs font-bold text-gray-500  tracking-wide">
                                                Card {i + 1}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => removeEvent(event.id)}
                                            className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {event.image && (
                                        <div className="flex justify-center bg-white border border-gray-100 rounded-lg p-2 h-24">
                                            <img
                                                src={event.image}
                                                alt={event.alt || "Preview"}
                                                className="h-full w-auto object-contain"
                                                onError={(e) => (e.currentTarget.style.display = "none")}
                                            />
                                        </div>
                                    )}

                                    <div className="grid grid-cols-1 gap-3">
                                        <div className="space-y-1">
                                            <label className="flex items-center gap-1 text-xs font-semibold text-gray-600">
                                                <ImageIcon className="h-3 w-3" />
                                                Card Image URL <span className="text-red-400">*</span>
                                            </label>
                                            <input
                                                type="url"
                                                value={event.image}
                                                onChange={(e) => updateEvent(event.id, "image", e.target.value)}
                                                placeholder="https://example.com/poster.png"
                                                className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="flex items-center gap-1 text-xs font-semibold text-gray-600">
                                                    <Type className="h-3 w-3" />
                                                    Alt Text
                                                </label>
                                                <input
                                                    type="text"
                                                    value={event.alt}
                                                    onChange={(e) => updateEvent(event.id, "alt", e.target.value)}
                                                    placeholder="Event title"
                                                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="flex items-center gap-1 text-xs font-semibold text-gray-600">
                                                    <LinkIcon className="h-3 w-3" />
                                                    Link (optional)
                                                </label>
                                                <input
                                                    type="url"
                                                    value={event.href ?? ""}
                                                    onChange={(e) => updateEvent(event.id, "href", e.target.value)}
                                                    placeholder="https://..."
                                                    className="w-full p-2 border border-gray-300 rounded-lg text-gray-900 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                                />
                                            </div>
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
