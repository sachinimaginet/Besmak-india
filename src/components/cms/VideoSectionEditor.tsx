"use client";

import { useState } from "react";
import { X, Save, Loader2, Plus, Trash2, Video, Type } from "lucide-react";
import { toast } from "sonner";

interface VideoData {
    url: string;
    title?: string;
    poster?: string;
}

interface VideoSectionEditorProps {
    sectionId: string;
    content: {
        videos?: VideoData[];
        overlay?: boolean;
    };
    onClose: () => void;
    onSave: () => void;
}

export default function VideoSectionEditor({
    sectionId,
    content,
    onClose,
    onSave,
}: VideoSectionEditorProps) {
    const [videos, setVideos] = useState<VideoData[]>(content.videos || []);
    const [overlay, setOverlay] = useState(content.overlay ?? true);
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
                        videos,
                        overlay,
                    },
                }),
            });

            if (!response.ok) throw new Error("Failed to save changes");

            toast.success("Video section updated successfully");
            onSave();
        } catch (error) {
            console.error(error);
            toast.error("Error saving changes");
        } finally {
            setIsSaving(false);
        }
    };

    const addVideo = () => {
        setVideos([...videos, { url: "", title: "" }]);
    };

    const removeVideo = (index: number) => {
        setVideos(videos.filter((_, i) => i !== index));
    };

    const updateVideo = (index: number, field: keyof VideoData, value: string) => {
        const newVideos = [...videos];
        newVideos[index] = { ...newVideos[index], [field]: value };
        setVideos(newVideos);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-6 border-b flex items-center justify-between bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800 tracking-wide">
                        Edit Video Section
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto space-y-8">
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="overlay"
                            checked={overlay}
                            onChange={(e) => setOverlay(e.target.checked)}
                            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="overlay" className="text-sm font-semibold text-gray-700">
                            Apply Dark Overlay to Videos
                        </label>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Videos</h3>
                            <button
                                onClick={addVideo}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors font-semibold text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                Add Video
                            </button>
                        </div>

                        <div className="space-y-4">
                            {videos.map((video, index) => (
                                <div key={index} className="p-6 border border-gray-100 rounded-2xl bg-gray-50/50 space-y-4 relative group">
                                    <button
                                        onClick={() => removeVideo(index)}
                                        className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Remove Video"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                <Video className="w-3 h-3" />
                                                Video URL
                                            </label>
                                            <input
                                                type="text"
                                                value={video.url}
                                                onChange={(e) => updateVideo(index, "url", e.target.value)}
                                                placeholder="https://..."
                                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                                <Type className="w-3 h-3" />
                                                Title / Caption
                                            </label>
                                            <input
                                                type="text"
                                                value={video.title}
                                                onChange={(e) => updateVideo(index, "title", e.target.value)}
                                                placeholder="Engineering the future..."
                                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                                            />
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
