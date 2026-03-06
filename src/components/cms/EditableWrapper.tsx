"use client";

import { useState } from "react";
import { Edit2 } from "lucide-react";
import { useAdmin } from "@/hooks/useAdmin";
import SectionEditor from "./SectionEditor";
import ClientsSectionEditor from "./ClientsSectionEditor";
import EventsAchievementsEditor from "./EventsAchievementsEditor";
import TwoCardsSectionEditor from "./TwoCardsSectionEditor";
import VideoSectionEditor from "./VideoSectionEditor";
import NewsSectionEditor from "./NewsSectionEditor";

interface EditableWrapperProps {
  sectionId: string;
  type: string;
  content: any;
  children: React.ReactNode;
  onUpdate?: () => void;
}

export default function EditableWrapper({
  sectionId,
  type,
  content,
  children,
  onUpdate,
}: EditableWrapperProps) {
  const { isAdmin } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);

  if (!isAdmin) return <>{children}</>;

  return (
    <div className="relative group border-2 border-transparent hover:border-blue-500 transition-colors">
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-4 right-4 z-50 p-2 bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
        title="Edit Section"
      >
        <Edit2 className="h-5 w-5" />
      </button>

      {children}

      {isEditing && type === "clients-section" && (
        <ClientsSectionEditor
          sectionId={sectionId}
          content={content}
          onClose={() => setIsEditing(false)}
          onSave={() => {
            setIsEditing(false);
            onUpdate?.();
          }}
        />
      )}

      {isEditing && type === "events-achievements" && (
        <EventsAchievementsEditor
          sectionId={sectionId}
          content={content}
          onClose={() => setIsEditing(false)}
          onSave={() => {
            setIsEditing(false);
            onUpdate?.();
          }}
        />
      )}

      {isEditing && type === "dual-cards-section" && (
        <TwoCardsSectionEditor
          sectionId={sectionId}
          content={content}
          onClose={() => setIsEditing(false)}
          onSave={() => {
            setIsEditing(false);
            onUpdate?.();
          }}
        />
      )}

      {isEditing && type === "video-section" && (
        <VideoSectionEditor
          sectionId={sectionId}
          content={content}
          onClose={() => setIsEditing(false)}
          onSave={() => {
            setIsEditing(false);
            onUpdate?.();
          }}
        />
      )}

      {isEditing && type === "news-section" && (
        <NewsSectionEditor
          sectionId={sectionId}
          content={content}
          onClose={() => setIsEditing(false)}
          onSave={() => {
            setIsEditing(false);
            onUpdate?.();
          }}
        />
      )}

      {isEditing && !["clients-section", "events-achievements", "dual-cards-section", "video-section", "news-section"].includes(type) && (
        <SectionEditor
          sectionId={sectionId}
          type={type}
          content={content}
          onClose={() => setIsEditing(false)}
          onSave={() => {
            setIsEditing(false);
            onUpdate?.();
          }}
        />
      )}
    </div>
  );
}
