"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { convertToEmbed } from "@/utils/youtube";
import LessonSkeleton from "@/components/LessonSkeleton";
import ProgressBar from "@/components/ProgressBar";
import MarkCompleteButton from "@/components/MarkCompleteButton";
import NextLessonButton from "@/components/NextLessonButton";

type Lesson = {
  id: string;
  title: string;
  videoUrl: string;
  isPreview: boolean;
};

type Section = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export default function CoursePage() {
  const params = useParams();
  const subjectId = params.subjectId as string;

  const [sections, setSections] = useState<Section[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // Flatten lessons for navigation and progress
  const flatLessons = sections.flatMap((s) => s.lessons);
  const currentIndex = flatLessons.findIndex((l) => l.id === currentLesson?.id);
  const completedCount = completedLessons.length;
  const totalLessons = flatLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  useEffect(() => {
    async function loadCourse() {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_BASE_URL || "https://pathtopro-backend.onrender.com/api";

        const res = await fetch(`${apiBase}/subjects/${subjectId}/tree`, {
          cache: "no-store",
        });

        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(`Failed to load course: ${res.status} — ${errorText || "Unknown error"}`);
        }

        const json = await res.json();
        const courseSections: Section[] = json.data?.sections || [];

        setSections(courseSections);

        // Restore last viewed lesson from localStorage
        const savedLessonId = localStorage.getItem(`lastLesson-${subjectId}`);
        const allLessons = courseSections.flatMap((s) => s.lessons);
        const savedLesson = savedLessonId ? allLessons.find((l) => l.id === savedLessonId) : null;
        setCurrentLesson(savedLesson ?? allLessons[0] ?? null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load course");
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [subjectId]);

  const handleLessonClick = (lesson: Lesson) => {
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons((prev) => [...prev, currentLesson.id]);
    }
    localStorage.setItem(`lastLesson-${subjectId}`, lesson.id);
    setCurrentLesson(lesson);
  };

  const handleMarkComplete = () => {
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons((prev) => [...prev, currentLesson.id]);
    }
  };

  const handleNextLesson = (nextLesson: Lesson) => {
    // Mark current lesson complete when navigating forward
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons((prev) => [...prev, currentLesson.id]);
    }
    localStorage.setItem(`lastLesson-${subjectId}`, nextLesson.id);
    setCurrentLesson(nextLesson);
    // Scroll to top of content area
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ─── Loading State ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar skeleton */}
        <div className="w-72 h-screen bg-white border-r animate-pulse">
          <div className="p-5 border-b space-y-3">
            <div className="h-5 bg-gray-200 rounded w-2/3" />
            <div className="h-2 bg-gray-200 rounded-full" />
          </div>
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-8 bg-gray-100 rounded-lg" />
            ))}
          </div>
        </div>
        {/* Main content skeleton */}
        <div className="flex-1 overflow-y-auto">
          <LessonSkeleton />
        </div>
      </div>
    );
  }

  // ─── Error State ────────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md p-8 bg-white rounded-xl shadow-sm text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error Loading Course</h2>
          <p className="text-gray-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ─── Empty State ─────────────────────────────────────────────────────────────
  if (!sections || sections.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <span className="text-5xl">📭</span>
          <h2 className="mt-4 text-xl font-bold text-gray-900">No Course Content Yet</h2>
          <p className="text-gray-500 text-sm mt-2">This subject doesn&apos;t have any lessons yet.</p>
        </div>
      </div>
    );
  }

  // ─── Main Layout ─────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      {/* ── Sidebar (fixed 280px) ─────────────────────────────────────────── */}
      <aside
        className="flex flex-col h-screen bg-white border-r border-gray-200 overflow-hidden flex-shrink-0"
        style={{ width: 280 }}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-gray-100 bg-white sticky top-0 z-10">
          <h2 className="font-bold text-gray-900 text-sm tracking-wide uppercase mb-3">
            Course Content
          </h2>
          <ProgressBar completed={completedCount} total={totalLessons} />
        </div>

        {/* Lesson List */}
        <div className="flex-1 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.id} className="border-b border-gray-100 last:border-b-0">
              {/* Section heading */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {section.title}
                </p>
              </div>

              {/* Lesson items */}
              <ul>
                {section.lessons.map((lesson) => {
                  const isCurrent = currentLesson?.id === lesson.id;
                  const isDone = completedLessons.includes(lesson.id);

                  return (
                    <li key={lesson.id}>
                      <button
                        onClick={() => handleLessonClick(lesson)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left text-sm transition-all
                          ${isCurrent
                            ? "bg-blue-50 border-l-4 border-blue-600 pl-3 text-blue-700 font-semibold"
                            : "border-l-4 border-transparent hover:bg-gray-50 text-gray-700"
                          }`}
                      >
                        {/* Status icon */}
                        <span
                          className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                            ${isDone
                              ? "bg-green-500 text-white"
                              : isCurrent
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-500"
                            }`}
                        >
                          {isDone ? "✓" : null}
                        </span>
                        <span className="flex-1 truncate leading-snug">{lesson.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto">
        {!currentLesson ? (
          <LessonSkeleton />
        ) : (
          <div className="max-w-4xl mx-auto px-6 py-8">

            {/* Global Progress */}
            <div className="mb-6">
              <ProgressBar completed={completedCount} total={totalLessons} colorClass="bg-blue-600" />
            </div>

            {/* Lesson title + badge */}
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                {currentLesson.title}
              </h1>
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full whitespace-nowrap">
                Lesson {currentIndex + 1} of {flatLessons.length}
              </span>
            </div>

            {currentLesson.isPreview && (
              <div className="inline-flex items-center gap-1.5 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full mb-4 font-medium">
                🔓 Free Preview
              </div>
            )}

            {/* Video Player */}
            <div className="rounded-xl overflow-hidden shadow-xl bg-black mb-6 border border-gray-200">
              {!currentLesson.videoUrl ? (
                <div className="aspect-video flex flex-col items-center justify-center text-gray-400 bg-gray-900">
                  <svg className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium text-gray-300">Video Unavailable</p>
                  <p className="text-sm text-gray-500 mt-1">This lesson doesn&apos;t have a video yet.</p>
                </div>
              ) : (
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    src={convertToEmbed(currentLesson.videoUrl)}
                    className="absolute top-0 left-0 w-full h-full"
                    title={currentLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                  />
                </div>
              )}
            </div>

            {/* Resume banner */}
            {completedCount > 0 && completedCount < totalLessons && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-blue-700 font-medium">Resume where you left off</p>
                  <p className="text-xs text-blue-500 mt-0.5">Continue your learning journey</p>
                </div>
                <button
                  className="flex-shrink-0 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                  onClick={() => {
                    const firstIncomplete = flatLessons.find((l) => !completedLessons.includes(l.id));
                    if (firstIncomplete) handleLessonClick(firstIncomplete);
                  }}
                >
                  Resume
                </button>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <MarkCompleteButton
                lessonId={currentLesson.id}
                initialCompleted={completedLessons.includes(currentLesson.id)}
                onComplete={handleMarkComplete}
              />
              <NextLessonButton
                lessons={flatLessons}
                currentLessonId={currentLesson.id}
                onNext={handleNextLesson}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
