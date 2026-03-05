"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

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

  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useEffect(() => {
    async function loadCourse() {
      try {
        const res = await fetch(
          `https://pathtopro-backend.onrender.com/api/subjects/${subjectId}/tree`,
          { cache: "no-store" }
        );

        const json = await res.json();
        const data = json.data;

        const courseSections = data.sections || [];

        setSections(courseSections);

        const firstLesson = courseSections?.[0]?.lessons?.[0];

        if (firstLesson) {
          setCurrentLesson(firstLesson);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }

    loadCourse();
  }, [subjectId]);

  function handleLessonClick(lesson: Lesson) {
    setCurrentLesson(lesson);

    if (!completedLessons.includes(lesson.id)) {
      setCompletedLessons((prev) => [...prev, lesson.id]);
    }
  }

  function getNextLesson() {
    if (!currentLesson) return null;

    const allLessons = sections.flatMap((s) => s.lessons);

    const index = allLessons.findIndex((l) => l.id === currentLesson.id);

    return allLessons[index + 1] || null;
  }

  const totalLessons = sections.reduce(
    (acc, sec) => acc + sec.lessons.length,
    0
  );

  const progress =
    totalLessons === 0
      ? 0
      : Math.round((completedLessons.length / totalLessons) * 100);

  if (loading) {
    return <div style={{ padding: 40 }}>Loading course content...</div>;
  }

  const nextLesson = getNextLesson();

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 320,
          borderRight: "1px solid #ddd",
          overflowY: "auto",
        }}
      >
        <h3 style={{ padding: "16px" }}>Course Content</h3>

        {/* Progress */}
        <div style={{ padding: "12px" }}>
          <div
            style={{
              height: "6px",
              background: "#eee",
              borderRadius: "6px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#2563eb",
              }}
            />
          </div>

          <p style={{ fontSize: "12px", marginTop: "4px" }}>
            {progress}% Complete
          </p>
        </div>

        {/* Sections */}
        {sections.map((section) => (
          <div key={section.id}>
            <h4 style={{ padding: "10px" }}>{section.title}</h4>

            {section.lessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => handleLessonClick(lesson)}
                style={{
                  padding: "8px 12px",
                  cursor: "pointer",
                  background:
                    currentLesson?.id === lesson.id
                      ? "#f1f5f9"
                      : "transparent",
                }}
              >
                {lesson.title}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Video Area */}
      <div style={{ flex: 1, padding: 30 }}>
        {currentLesson && (
          <>
            <h2>{currentLesson.title}</h2>

            {currentLesson.isPreview && (
              <p style={{ color: "#2563eb", marginBottom: "10px" }}>
                🔓 Free Preview Available
              </p>
            )}

            <iframe
              width="100%"
              height="480"
              src={currentLesson.videoUrl}
              title="Lesson Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            {/* Next Lesson */}
            <div style={{ marginTop: "20px" }}>
              {nextLesson ? (
                <button
                  onClick={() => handleLessonClick(nextLesson)}
                  style={{
                    padding: "10px 16px",
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  Next Lesson →
                </button>
              ) : (
                <button
                  disabled
                  style={{
                    padding: "10px 16px",
                    background: "#ccc",
                    border: "none",
                    borderRadius: "6px",
                  }}
                >
                  Course Complete
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
