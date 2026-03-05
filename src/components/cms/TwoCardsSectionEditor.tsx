"use client";

import { useState } from "react";
import { X, Save, Loader2, Type, AlignLeft, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";

interface CardContent {
    title: string;
    description: string;
    link: string;
    buttonText: string;
}

interface TwoCardsSectionEditorProps {
    sectionId: string;
    content: {
        leftCard?: string;
        rightCard?: string;
    };
    onClose: () => void;
    onSave: () => void;
}

export default function TwoCardsSectionEditor({
    sectionId,
    content,
    onClose,
    onSave,
}: TwoCardsSectionEditorProps) {
    const parseCard = (json?: string, defaultData?: CardContent): CardContent => {
        try {
            return json ? JSON.parse(json) : defaultData!;
        } catch {
            return defaultData!;
        }
    };

    const [leftCard, setLeftCard] = useState<CardContent>(parseCard(content.leftCard, {
        title: "CSR Activities",
        description: "",
        link: "/csr",
        buttonText: "Read More"
    }));

    const [rightCard, setRightCard] = useState<CardContent>(parseCard(content.rightCard, {
        title: "Career Opportunities at Besmak",
        description: "",
        link: "/careers",
        buttonText: "Join Us"
    }));

    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const updatedContent = {
                leftCard: JSON.stringify(leftCard),
                rightCard: JSON.stringify(rightCard),
            };

            const res = await fetch(`/api/cms/sections/${sectionId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: updatedContent }),
            });

            if (!res.ok) throw new Error("Failed to save");
            toast.success("Section updated successfully!");
            onSave();
        } catch (error) {
            toast.error("Error saving changes");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden max-h-[92vh]">

                {/* Header */}
                <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Edit Dual Cards Section</h2>
                        <p className="text-xs text-gray-500 mt-0.5">Manage CSR and Careers cards content</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Left Card Editor */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <div className="w-2 h-6 bg-beige-500 rounded-full" style={{ backgroundColor: '#f5f1ea' }}></div>
                            <h3 className="font-bold text-gray-800">Left Card (CSR)</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Type className="w-4 h-4" /> Title
                                </label>
                                <input
                                    type="text"
                                    value={leftCard.title}
                                    onChange={(e) => setLeftCard({ ...leftCard, title: e.target.value })}
                                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <AlignLeft className="w-4 h-4" /> Description (use double newline for paragraphs)
                                </label>
                                <textarea
                                    value={leftCard.description}
                                    onChange={(e) => setLeftCard({ ...leftCard, description: e.target.value })}
                                    rows={8}
                                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Button Text</label>
                                    <input
                                        type="text"
                                        value={leftCard.buttonText}
                                        onChange={(e) => setLeftCard({ ...leftCard, buttonText: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4" /> Link
                                    </label>
                                    <input
                                        type="text"
                                        value={leftCard.link}
                                        onChange={(e) => setLeftCard({ ...leftCard, link: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Card Editor */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <div className="w-2 h-6 bg-white border border-gray-200 rounded-full"></div>
                            <h3 className="font-bold text-gray-800">Right Card (Careers)</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Type className="w-4 h-4" /> Title
                                </label>
                                <input
                                    type="text"
                                    value={rightCard.title}
                                    onChange={(e) => setRightCard({ ...rightCard, title: e.target.value })}
                                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <AlignLeft className="w-4 h-4" /> Description (use double newline for paragraphs)
                                </label>
                                <textarea
                                    value={rightCard.description}
                                    onChange={(e) => setRightCard({ ...rightCard, description: e.target.value })}
                                    rows={8}
                                    className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700">Button Text</label>
                                    <input
                                        type="text"
                                        value={rightCard.buttonText}
                                        onChange={(e) => setRightCard({ ...rightCard, buttonText: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                        <LinkIcon className="w-4 h-4" /> Link
                                    </label>
                                    <input
                                        type="text"
                                        value={rightCard.link}
                                        onChange={(e) => setRightCard({ ...rightCard, link: e.target.value })}
                                        className="w-full p-2.5 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-end gap-3 flex-shrink-0">
                    <button onClick={onClose} className="px-5 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors">
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-5 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-blue-200 transition-all active:scale-95"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4" /> Save Changes
                            </>
                        )}
                    </button>
                </div>

            </div>
        </div>
    );
}
