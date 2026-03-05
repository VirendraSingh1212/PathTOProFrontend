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

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "320px",
          borderRight: "1px solid #e5e7eb",
          overflowY: "auto",
          padding: "20px",
          backgroundColor: "#fafafa",
        }}
      >
        <h3 style={{ marginBottom: "16px", fontSize: "18px", fontWeight: "600" }}>Course Content</h3>

        {/* Progress Bar */}
        <div style={{ marginBottom: "20px", padding: "12px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "14px" }}>
            <span style={{ fontWeight: "500" }}>Course Progress</span>
            <span style={{ fontWeight: "600", color: "#2563eb" }}>{progressPercent}%</span>
          </div>
          <div style={{ width: "100%", backgroundColor: "#e5e7eb", borderRadius: "999px", height: "8px", overflow: "hidden" }}>
            <div
              style={{
                width: `${progressPercent}%`,
                backgroundColor: "#2563eb",
                height: "100%",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <p style={{ fontSize: "12px", color: "#6b7280", marginTop: "6px" }}>
            {completedCount} of {totalLessons} lessons completed
          </p>
        </div>

        {/* Sections and Lessons */}
        {sections.map((section) => (
          <div key={section.id} style={{ marginBottom: "20px" }}>
            <h4 style={{ 
              marginTop: "16px", 
              marginBottom: "12px", 
              fontWeight: "600",
              fontSize: "14px",
              color: "#374151",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              {section.title}
            </h4>

            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {section.lessons.map((lesson) => (
                <li
                  key={lesson.id}
                  onClick={() => handleLessonClick(lesson)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 12px",
                    marginBottom: "4px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    backgroundColor: currentLesson?.id === lesson.id ? "#dbeafe" : "transparent",
                    fontWeight: currentLesson?.id === lesson.id ? "600" : "400",
                    color: currentLesson?.id === lesson.id ? "#1e40af" : "#374151",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (currentLesson?.id !== lesson.id) {
                      e.currentTarget.style.backgroundColor = "#f3f4f6";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (currentLesson?.id !== lesson.id) {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }
                  }}
                >
                  <span style={{ fontSize: "14px", flex: 1 }}>{lesson.title}</span>
                  {completedLessons.includes(lesson.id) && (
                    <span style={{ color: "#16a34a", fontWeight: "bold", marginLeft: "8px" }}>✓</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Video Area */}
      <div style={{ flex: 1, padding: "30px", backgroundColor: "white", overflowY: "auto" }}>
        {!currentLesson ? (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            height: "400px",
            color: "#6b7280"
          }}>
            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "18px", marginBottom: "8px" }}>Loading lesson...</p>
              <p style={{ fontSize: "14px" }}>Please wait</p>
            </div>
          </div>
        ) : (
          <>
            <h2 style={{ 
              marginBottom: "12px", 
              fontSize: "24px", 
              fontWeight: "700",
              color: "#111827"
            }}>
              {currentLesson.title}
            </h2>

            {currentLesson.isPreview && (
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "#2563eb",
                  backgroundColor: "#dbeafe",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  fontSize: "13px",
                  fontWeight: "500",
                  marginBottom: "16px",
                }}
              >
                🔓 Free Preview Available
              </div>
            )}

            <div style={{ 
              position: "relative",
              paddingTop: "56.25%", /* 16:9 Aspect Ratio */
              marginBottom: "24px",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
              backgroundColor: "#000"
            }}>
              <iframe
                src={toEmbed(currentLesson.videoUrl)}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  borderRadius: "12px",
                }}
                title={currentLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              />
            </div>

            {/* Navigation Buttons */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "24px",
              paddingTop: "24px",
              borderTop: "1px solid #e5e7eb"
            }}>
              <button
                onClick={goToNextLesson}
                disabled={!nextLesson}
                style={{
                  padding: "12px 24px",
                  backgroundColor: nextLesson ? "#2563eb" : "#d1d5db",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  cursor: nextLesson ? "pointer" : "not-allowed",
                  fontSize: "15px",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (nextLesson) {
                    e.currentTarget.style.backgroundColor = "#1d4ed8";
                  }
                }}
                onMouseLeave={(e) => {
                  if (nextLesson) {
                    e.currentTarget.style.backgroundColor = "#2563eb";
                  }
                }}
              >
                {nextLesson ? "Next Lesson →" : "Course Complete 🎉"}
              </button>

              {currentIndex >= 0 && (
                <p style={{ color: "#6b7280", fontSize: "14px" }}>
                  Lesson {currentIndex + 1} of {totalLessons}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
