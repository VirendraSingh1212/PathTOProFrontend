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

function convertYoutubeUrl(url?: string) {
  if (!url) return "";

  if (url.includes("watch?v=")) {
    const id = url.split("watch?v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  if (url.includes("youtu.be/")) {
    const id = url.split("youtu.be/")[1];
    return `https://www.youtube.com/embed/${id}`;
  }

  return url;
}

export default function CoursePage() {
  const params = useParams();
  const subjectId = params.subjectId as string;

  const [sections, setSections] = useState<Section[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourse() {
      try {
        console.log('Fetching course tree for subject:', subjectId);
        const res = await fetch(
          `https://pathtopro-backend.onrender.com/api/subjects/${subjectId}/tree`,
          { cache: "no-store" }
        );

        console.log('Response status:', res.status);

        if (!res.ok) {
          throw new Error(`Failed to load course: ${res.status}`);
        }

        const json = await res.json();
        console.log('Course data:', json);

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
        }}
      >
        <h3 style={{ marginBottom: "16px" }}>Course Content</h3>

        {sections.map((section) => (
          <div key={section.id}>
            <h4 style={{ marginTop: "16px", fontWeight: "600" }}>
              {section.title}
            </h4>

            {section.lessons.map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => setCurrentLesson(lesson)}
                style={{
                  padding: "8px 0",
                  cursor: "pointer",
                  color:
                    currentLesson?.id === lesson.id
                      ? "#2563eb"
                      : "#374151",
                }}
              >
                {lesson.title}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Video Area */}
      <div style={{ flex: 1, padding: "30px" }}>
        {currentLesson && (
          <>
            <h2 style={{ marginBottom: "10px" }}>{currentLesson.title}</h2>

            {currentLesson.isPreview && (
              <div
                style={{
                  color: "#2563eb",
                  marginBottom: "10px",
                }}
              >
                🔓 Free Preview Available
              </div>
            )}

            <iframe
              src={convertYoutubeUrl(currentLesson?.videoUrl)}
              title={currentLesson?.title}
              className="w-full h-[450px] rounded-lg border"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

            <button
              style={{
                marginTop: "20px",
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
          </>
        )}
      </div>
    </div>
  );
}
