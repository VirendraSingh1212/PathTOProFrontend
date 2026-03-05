"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { BookOpen, PlayCircle } from "lucide-react";
import { getEmbedUrl } from "@/utils/video";

type Lesson = {
  id: string;
  title: string;
  videoUrl?: string;
  video_url?: string;
  duration?: number;
  position?: number;
  isPreview?: boolean;
};

type Section = {
  id: string;
  title: string;
  position?: number;
  lessons: Lesson[];
};

type SubjectTreeResponse = {
  success?: boolean;
  data?: {
    id: string;
    title: string;
    slug?: string;
    description?: string;
    sections: Section[];
  };
};

export default function SubjectCoursePage() {
  const params = useParams();
  const subjectId = params?.subjectId as string;

  // State management
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [sections, setSections] = useState<Section[]>([]);

  // Flatten lessons for navigation and progress
  const allLessons = useMemo(() => {
    return sections
      .slice()
      .sort((a, b) => (a.position || 0) - (b.position || 0))
      .flatMap((s) =>
        (s.lessons || [])
          .slice()
          .sort((a, b) => (a.position || 0) - (b.position || 0))
      );
  }, [sections]);

  // Fetch progress from backend
  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await apiClient.get(`/progress/subjects/${subjectId}`);
        const completed = res.data?.data?.completed_video_ids || res.data?.completedLessons || [];
        setCompletedLessons(completed);
      } catch (error) {
        console.error("Failed to fetch progress", error);
      }
    }

    if (subjectId) fetchProgress();
  }, [subjectId]);

  // Initialize active lesson from localStorage or auto-select first lesson
  useEffect(() => {
    const savedLesson = localStorage.getItem(`resume-${subjectId}`);
    if (savedLesson) {
      try {
        setActiveLesson(JSON.parse(savedLesson));
      } catch {
        console.error('Failed to load saved lesson');
      }
    } else if (sections.length > 0 && !activeLesson) {
      const first = sections
        .slice()
        .sort((a, b) => (a.position || 0) - (b.position || 0))
        .flatMap((s) =>
          (s.lessons || [])
            .slice()
            .sort((a, b) => (a.position || 0) - (b.position || 0))
        )[0];
      if (first) setActiveLesson(first);
    }
  }, [subjectId, sections, activeLesson]);

  // Save resume lesson to localStorage whenever active lesson changes
  useEffect(() => {
    if (activeLesson) {
      localStorage.setItem(
        `resume-${subjectId}`,
        JSON.stringify(activeLesson)
      );
    }
  }, [subjectId, activeLesson]);

  // Go to next lesson
  const goToNextLesson = () => {
    if (!activeLesson) return;

    const index = allLessons.findIndex((l) => l.id === activeLesson.id);
    if (index !== -1 && index < allLessons.length - 1) {
      setActiveLesson(allLessons[index + 1]);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-8">
      {/* Lesson Player Content */}
      {!activeLesson && (
        <div className="flex items-center justify-center h-full text-gray-500">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700">Select a lesson to start learning</h3>
          </div>
        </div>
      )}

      {activeLesson && (
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {activeLesson.title}
          </h2>

          <div className="mb-4">
            {activeLesson.isPreview ? (
              <span className="inline-flex items-center gap-1 text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full">
                🔓 Free Preview Available
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                🔒 Locked Content
              </span>
            )}
          </div>

          {activeLesson.videoUrl || activeLesson.video_url ? (
            <div className="aspect-video w-full rounded overflow-hidden mb-4">
              {(function() {
                const videoUrl = activeLesson.videoUrl || activeLesson.video_url;
                if (!videoUrl) return null;
                const embedUrl = getEmbedUrl(videoUrl);
                if (!embedUrl) return null;
                return (
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    title={activeLesson.title}
                  />
                );
              })()}
            </div>
          ) : (
            <div className="p-10 border rounded-lg bg-white text-center text-gray-500">
              <PlayCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-lg font-medium">No video available for this lesson yet.</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={goToNextLesson}
              disabled={!allLessons.find((l) => l.id === activeLesson.id) || 
                        allLessons.indexOf(allLessons.find((l) => l.id === activeLesson.id)!) === allLessons.length - 1}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              Next Lesson
              <span className="text-sm">→</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
