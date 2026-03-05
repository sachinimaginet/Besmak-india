"use client";

import { useState } from "react";
import { X, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SectionEditorProps {
  sectionId: string;
  type: string;
  content: any;
  onClose: () => void;
  onSave: () => void;
}

export default function SectionEditor({
  sectionId,
  type,
  content,
  onClose,
  onSave,
}: SectionEditorProps) {
  const [editedContent, setEditedContent] = useState(content);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/cms/sections/${sectionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: editedContent }),
      });

      if (!response.ok) throw new Error("Failed to save changes");

      toast.success("Section updated successfully");
      onSave();
    } catch (error) {
      console.error(error);
      toast.error("Error saving changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setEditedContent((prev: any) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-6 border-b flex items-center justify-between bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
            Edit {type} Section
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto space-y-6">
          {Object.keys(content).map((key) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 capitalize">
                {key.replace(/([A-Z])/g, " $1").trim()}
              </label>
              {typeof content[key] === "string" && content[key].length > 50 ? (
                <textarea
                  value={editedContent[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none min-h-[120px] transition-all text-gray-900"
                />
              ) : (
                <input
                  type="text"
                  value={editedContent[key]}
                  onChange={(e) => handleChange(key, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900"
                />
              )}
            </div>
          ))}
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
