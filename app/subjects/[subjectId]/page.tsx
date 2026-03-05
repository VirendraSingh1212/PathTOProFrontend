"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { BookOpen, PlayCircle } from "lucide-react";

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

  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSubjectTree() {
      try {
        setLoading(true);
        setError(null);

        const res = await apiClient.get<SubjectTreeResponse>(
          `/subjects/${subjectId}/tree`
        );

        const data = res?.data?.data;
        const fetchedSections = data?.sections || [];

        setSections(fetchedSections);

        // Auto-select first lesson if none selected
        if (fetchedSections.length > 0) {
          const first = fetchedSections
            .slice()
            .sort((a, b) => (a.position || 0) - (b.position || 0))
            .flatMap((s) =>
              (s.lessons || [])
                .slice()
                .sort((a, b) => (a.position || 0) - (b.position || 0))
            )[0];

          if (first) setActiveLesson(first);
        }
      } catch (err) {
        console.error("Failed to load subject tree:", err);
        setError("Failed to load course content.");
      } finally {
        setLoading(false);
      }
    }

    if (subjectId) loadSubjectTree();
  }, [subjectId]);

  // Placeholder for future backend integration
  const markLessonComplete = async (lessonId: string) => {
    try {
      // later connect to:
      // POST /api/progress
      // await apiClient.post("/progress", { lessonId });

      console.log("Lesson completed:", lessonId);
    } catch (err) {
      console.error("Progress update failed", err);
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    setActiveLesson(lesson);
  };

  if (loading) {
    return (
      <div className="p-10 text-gray-500 flex items-center justify-center">
        Loading course content...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-10 text-red-500 text-center">
        {error}
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
        <h2 className="text-xl font-semibold text-gray-700">No Content Available</h2>
        <p className="text-gray-500 mt-2 max-w-md">
          Lessons for this subject have not been added yet. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] bg-white overflow-hidden">
      {/* Sidebar */} 
      <div className="w-80 border-r overflow-y-auto p-4 bg-white">
        <h2 className="font-bold text-lg mb-4 tracking-tight text-gray-900">Course Content</h2>

        {sections.length === 0 && (
          <div className="text-sm text-gray-500">
            No content available.
          </div>
        )}

        {sections.map((section) => (
          <div key={section.id} className="mb-6">
            <h3 className="font-semibold text-base mb-3 flex items-center gap-2 text-gray-800">
              <PlayCircle className="h-4 w-4 text-blue-600" />
              {section.title}
            </h3>

            <ul className="space-y-2">
              {section.lessons?.map((lesson) => {
                const active = activeLesson?.id === lesson.id;

                return (
                  <li
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    className={`flex justify-between items-center text-sm cursor-pointer p-2 rounded transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {lesson.isPreview ? "🔓" : "🔒"} {lesson.title}
                    </span>

                    {lesson.isPreview && (
                      <span className="text-xs text-blue-600 font-medium">
                        Free Preview
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Lesson Player */}
      <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
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
              <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden shadow-lg border">
                <iframe
                  src={activeLesson.videoUrl || activeLesson.video_url}
                  className="w-full h-full"
                  allowFullScreen
                  onLoad={() =>
                    markLessonComplete(activeLesson.id)
                  }
                  title={activeLesson.title}
                />
              </div>
            ) : (
              <div className="p-10 border rounded-lg bg-white text-center text-gray-500">
                <PlayCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-lg font-medium">No video available for this lesson yet.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
