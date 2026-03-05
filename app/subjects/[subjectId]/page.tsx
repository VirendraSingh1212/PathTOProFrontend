"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { BookOpen, PlayCircle } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  isPreview?: boolean;
  video_url?: string;
  videoUrl?: string;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export default function SubjectPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  useEffect(() => {
    async function loadSubjectTree() {
      try {
        setLoading(true);
        const response = await apiClient.get(`/subjects/${subjectId}/tree`);
        const sectionsData = response.data?.data?.sections || response.data || [];
        setSections(sectionsData);
      } catch (error) {
        console.error("Failed to load subject tree:", error);
        setSections([]);
      } finally {
        setLoading(false);
      }
    }

    if (subjectId) {
      loadSubjectTree();
    }
  }, [subjectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">Loading content...</p>
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
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar - Course Content */}
      <div className="w-80 flex-shrink-0 border-r bg-white overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Course Content</h2>
          
          {sections.map((section) => (
            <div key={section.id} className="mb-6">
              <h3 className="font-semibold text-base text-gray-800 mb-3 flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-blue-600" />
                {section.title}
              </h3>

              <ul className="space-y-2">
                {section.lessons && section.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    onClick={() => setActiveLesson(lesson)}
                    className={`cursor-pointer text-sm p-2 rounded-md transition-colors ${
                      activeLesson?.id === lesson.id
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {lesson.isPreview ? "🔓" : "🔒"}
                      </span>
                      <span className="flex-1">{lesson.title}</span>
                      {lesson.isPreview && (
                        <span className="text-xs text-blue-600 font-medium ml-auto">
                          Free Preview
                        </span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Lesson Player */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-8">
          {activeLesson ? (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {activeLesson.title}
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                {activeLesson.isPreview ? (
                  <span className="inline-flex items-center gap-1 text-blue-600 font-medium">
                    🔓 Free Preview Available
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-gray-500">
                    🔒 Locked Content
                  </span>
                )}
              </p>

              <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg">
                {activeLesson.videoUrl || activeLesson.video_url ? (
                  <iframe
                    className="w-full h-full min-h-[450px]"
                    src={activeLesson.videoUrl || activeLesson.video_url}
                    title={activeLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="flex items-center justify-center h-full min-h-[450px] text-white">
                    <div className="text-center">
                      <PlayCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-lg font-medium">Video not available</p>
                      <p className="text-sm text-gray-400 mt-2">This lesson doesn&apos;t have a video yet</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center gap-4">
                <button
                  onClick={() => setActiveLesson(null)}
                  className="text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  ← Back to lessons
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-center">
              <BookOpen className="h-20 w-20 text-gray-300 mb-6" />
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Select a Lesson to Start Learning
              </h2>
              <p className="text-gray-500 max-w-md">
                Choose a lesson from the sidebar to begin watching the video and learning about {subjectId}.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
