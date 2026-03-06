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
        console.log('📚 Loading course for subjectId:', subjectId);
        
        const res = await fetch(
          `https://pathtopro-backend.onrender.com/api/subjects/${subjectId}/tree`,
          { cache: "no-store" }
        );

        console.log('📡 Response status:', res.status);

        if (!res.ok) {
          // Try to get error details from response
          const errorText = await res.text();
          console.error('❌ API Error:', res.status, errorText);
          throw new Error(`Failed to load course: ${res.status} - ${errorText || 'Unknown error'}`);
        }

        const json = await res.json();
        console.log('✅ Course data received:', json);
        
        const courseSections = json.data?.sections || [];

        setSections(courseSections);

        const firstLesson = courseSections?.[0]?.lessons?.[0];

        if (firstLesson) {
          setCurrentLesson(firstLesson);
        }

        setLoading(false);
      } catch (err) {
        console.error('❌ Error loading course:', err);
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
    
    // Save next lesson to localStorage
    localStorage.setItem(`lastLesson-${subjectId}`, nextLesson.id);
    
    setCurrentLesson(nextLesson);
  };

  const handleLessonClick = (lesson: Lesson) => {
    // Mark previous lesson as completed when switching
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons((prev) => [...prev, currentLesson.id]);
    }
    
    // Save to localStorage for resume feature
    localStorage.setItem(`lastLesson-${subjectId}`, lesson.id);
    
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

  // Resume last lesson function (hybrid: localStorage + backend)
  const resumeLastLesson = async () => {
    try {
      // Try localStorage first (immediate)
      const savedLessonId = localStorage.getItem(`lastLesson-${subjectId}`);
      
      if (savedLessonId) {
        const savedLesson = flatLessons.find(l => l.id === savedLessonId);
        if (savedLesson) {
          setCurrentLesson(savedLesson);
          console.log('✅ Resumed from localStorage:', savedLesson.title);
          return;
        }
      }

      // Fallback: Try backend API
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/progress/subject/${subjectId}`);
        const data = await res.json();
        
        if (data?.lastLessonId) {
          const lastLesson = flatLessons.find(l => l.id === data.lastLessonId);
          if (lastLesson) {
            setCurrentLesson(lastLesson);
            console.log('✅ Resumed from backend:', lastLesson.title);
            return;
          }
        }
      } catch (backendErr) {
        console.log('ℹ️ Backend progress not available, using localStorage only');
      }

      // If nothing found, start from beginning or first incomplete lesson
      const firstIncomplete = flatLessons.find(l => !completedLessons.includes(l.id));
      if (firstIncomplete) {
        setCurrentLesson(firstIncomplete);
      } else if (flatLessons.length > 0) {
        setCurrentLesson(flatLessons[0]);
      }
    } catch (err) {
      console.error('❌ Failed to resume:', err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 h-screen overflow-y-auto border-r bg-white">
        <div className="sticky top-0 bg-white p-5 border-b">
          <h2 className="text-lg font-bold text-gray-900">Course Content</h2>
          
          {/* Mini Progress in Sidebar */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium text-gray-600">Your Progress</span>
              <span className="text-xs font-bold text-blue-600">{progressPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="sticky top-28 p-5 h-fit">
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
            
            {/* Global Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-gray-700">Course Progress</h2>
                <span className="text-sm text-gray-500">
                  Lesson {currentIndex + 1} of {flatLessons.length}
                </span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-2 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Resume Learning Banner */}
            {completedCount > 0 && completedCount < totalLessons && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 font-medium">
                    Resume where you left off
                  </p>
                  <p className="text-xs text-blue-500">
                    Continue your learning journey
                  </p>
                </div>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 transition"
                  onClick={resumeLastLesson}
                >
                  Resume
                </button>
              </div>
            )}

            {/* Lesson Header */}
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {currentLesson.title}
              </h1>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Lesson {currentIndex + 1} of {flatLessons.length}
              </span>
            </div>

            {/* Preview Badge */}
            {currentLesson.isPreview && (
              <div className="inline-flex items-center gap-1.5 text-sm text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full mb-4 font-medium">
                🔓 Free Preview Available
              </div>
            )}

            {/* Video Player - Polished */}
            <div className="max-w-4xl mx-auto shadow-xl rounded-xl overflow-hidden bg-white mb-6 border border-gray-100">
              {!currentLesson.videoUrl ? (
                <div className="aspect-video flex items-center justify-center text-gray-400 bg-gray-50">
                  <div className="text-center py-20">
                    <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="mt-4 text-lg font-medium">Video Unavailable</p>
                    <p className="mt-2 text-sm">This lesson doesn't have a video yet.</p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={toEmbed(currentLesson.videoUrl)}
                    className="absolute top-0 left-0 w-full h-full"
                    title={currentLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                  />
                </div>
              )}
            </div>

            {/* Navigation Buttons - Improved Alignment */}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={markLessonComplete}
                className="bg-green-600 text-white px-6 py-2.5 rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2 shadow-sm"
              >
                ✓ Mark as Complete
              </button>

              <div className="flex items-center gap-4">
                <button
                  onClick={goToNextLesson}
                  disabled={!nextLesson}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition font-medium flex items-center gap-2 shadow-sm"
                >
                  {nextLesson ? 'Next Lesson →' : 'Course Complete 🎉'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
