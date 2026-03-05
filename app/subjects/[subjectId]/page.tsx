"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { toEmbed } from "@/utils/youtube";

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
  const flatLessons = sections.flatMap((section) => section.lessons);
  const currentIndex = flatLessons.findIndex(
    (lesson) => lesson.id === currentLesson?.id
  );
  const nextLesson = flatLessons[currentIndex + 1];

  // Calculate progress
  const totalLessons = flatLessons.length;
  const completedCount = completedLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await fetch(
          `https://pathtopro-backend.onrender.com/api/subjects/${subjectId}/tree`,
          { cache: "no-store" }
        );

        if (!res.ok) {
          throw new Error(`Failed to load course: ${res.status}`);
        }

        const json = await res.json();
        const courseSections = json.data?.sections || [];

        setSections(courseSections);

        const firstLesson = courseSections?.[0]?.lessons?.[0];

        if (firstLesson) {
          setCurrentLesson(firstLesson);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error loading course:', err);
        setError(err instanceof Error ? err.message : 'Failed to load course');
        setLoading(false);
      }
    }

    loadCourse();
  }, [subjectId]);

  const goToNextLesson = () => {
    if (!nextLesson) return;
    
    // Mark current lesson as completed
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons((prev) => [...prev, currentLesson.id]);
    }
    
    setCurrentLesson(nextLesson);
  };

  const handleLessonClick = (lesson: Lesson) => {
    // Mark previous lesson as completed when switching
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons((prev) => [...prev, currentLesson.id]);
    }
    setCurrentLesson(lesson);
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Loading course...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: 40 }}>
        <h2 style={{ color: '#dc2626', marginBottom: '10px' }}>Error Loading Course</h2>
        <p style={{ color: '#666' }}>{error}</p>
        <p style={{ marginTop: '10px', fontSize: '14px' }}>Subject ID: {subjectId}</p>
      </div>
    );
  }

  if (!sections || sections.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2 style={{ marginBottom: '10px' }}>No Course Content Available</h2>
        <p style={{ color: '#666' }}>This subject doesn't have any lessons yet.</p>
        <p style={{ marginTop: '10px', fontSize: '14px' }}>Subject ID: {subjectId}</p>
      </div>
    );
  }

  const markLessonComplete = () => {
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons((prev) => [...prev, currentLesson.id]);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 h-screen overflow-y-auto border-r sticky top-0 bg-white">
        <div className="p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Course Content</h2>

          {/* Progress Bar */}
          <div className="mb-6 p-3 bg-gray-50 rounded-lg border">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-gray-600 uppercase">Progress</span>
              <span className="text-sm font-bold text-blue-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {completedCount} / {totalLessons} lessons
            </p>
          </div>

          {/* Sections and Lessons */}
          {sections.map((section) => (
            <div key={section.id} className="mb-5">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {section.title}
              </h3>

              <ul className="space-y-1">
                {section.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    onClick={() => handleLessonClick(lesson)}
                    className={`flex justify-between items-center px-3 py-2 text-sm rounded cursor-pointer transition ${
                      currentLesson?.id === lesson.id
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex-1 truncate">{lesson.title}</span>
                    {completedLessons.includes(lesson.id) && (
                      <span className="text-green-600 font-bold ml-2">✓</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-8">
        {!currentLesson ? (
          <div className="flex items-center justify-center h-[400px] text-gray-500">
            <div className="text-center">
              <p className="text-lg mb-2">Loading lesson...</p>
              <p className="text-sm">Please wait</p>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Lesson Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {currentLesson.title}
              </h1>
              <span className="text-sm text-gray-500">
                Lesson {currentIndex + 1} of {flatLessons.length}
              </span>
            </div>

            {/* Preview Badge */}
            {currentLesson.isPreview && (
              <div className="inline-flex items-center gap-1.5 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full mb-4 font-medium">
                🔓 Free Preview Available
              </div>
            )}

            {/* Video Player Card */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={toEmbed(currentLesson.videoUrl)}
                  className="absolute top-0 left-0 w-full h-full rounded-lg"
                  title={currentLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  frameBorder="0"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-5">
              <button
                onClick={markLessonComplete}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2"
              >
                ✓ Mark as Complete
              </button>

              <div className="flex items-center gap-4">
                <button
                  onClick={goToNextLesson}
                  disabled={!nextLesson}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium flex items-center gap-2"
                >
                  Next Lesson →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
