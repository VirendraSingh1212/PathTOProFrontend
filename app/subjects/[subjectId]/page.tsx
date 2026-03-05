"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import apiClient from "@/lib/apiClient";
import { BookOpen, PlayCircle, CheckCircle } from "lucide-react";
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
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

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

  // Calculate progress percentage
  const progressPercentage = useMemo(() => {
    if (allLessons.length === 0) return 0;
    return Math.round((completedLessons.length / allLessons.length) * 100);
  }, [completedLessons, allLessons.length]);

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

        // Load saved progress from localStorage
        const savedLesson = localStorage.getItem(`resume-${subjectId}`);
        if (savedLesson) {
          try {
            setActiveLesson(JSON.parse(savedLesson));
          } catch {
            console.error('Failed to load saved lesson');
          }
        }

        // Auto-select first lesson if no saved lesson
        if (!activeLesson && fetchedSections.length > 0) {
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
  }, [subjectId, activeLesson]);

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

  // Handle lesson click
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

        {/* Progress Bar */}
        {allLessons.length > 0 && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-2 font-medium">
              {progressPercentage}% Complete ({completedLessons.length}/{allLessons.length})
            </p>
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
                const completed = completedLessons.includes(lesson.id);

                return (
                  <li
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    className={`flex justify-between items-center text-sm cursor-pointer p-2 rounded transition-colors ${
                      active
                        ? "bg-blue-50 text-blue-600 font-medium"
                        : completed
                        ? "bg-green-50 text-green-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <span className="text-base flex-shrink-0">
                          {lesson.isPreview ? "🔓" : "🔒"}
                        </span>
                      )}
                      <span className="flex-1">{lesson.title}</span>
                    </span>

                    {lesson.isPreview && !completed && (
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
    </div>
  );
}
