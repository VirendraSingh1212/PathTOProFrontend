"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { convertToEmbed } from "@/utils/youtube";
import LessonSkeleton from "@/components/LessonSkeleton";
import ProgressBar from "@/components/ProgressBar";
import MarkCompleteButton from "@/components/MarkCompleteButton";
import NextLessonButton from "@/components/NextLessonButton";
import ChatFAB from "@/components/ChatFAB";
import ChatbotOverlay from "@/components/ChatbotOverlay";
import LoginModal from "@/components/LoginModal";
import { useAuthStore } from "@/store/authStore";

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

  // Auth state from global store
  const { isAuthenticated: isLoggedIn, authLoading } = useAuthStore();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // AI Summary state
  const [summaryText, setSummaryText] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  // Flatten lessons for navigation and progress
  const flatLessons = sections.flatMap((s) => s.lessons);
  const currentIndex = flatLessons.findIndex((l) => l.id === currentLesson?.id);
  const completedCount = completedLessons.length;
  const totalLessons = flatLessons.length;

  useEffect(() => {
    async function loadCourse() {
      try {
        const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pathtopro-backend.onrender.com/api';
        const cleanUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
        const apiBase = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

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

  const handleMarkComplete = (opts?: { revert?: boolean }) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (opts?.revert) {
      setCompletedLessons((prev) => prev.filter(id => id !== currentLesson?.id));
      return;
    }
    // Optimistic UI update
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons((prev) => [...prev, currentLesson.id]);
    }
  };

  const handleNextLesson = (nextLesson: Lesson) => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    // Mark current lesson complete when navigating forward (optional UI choice, keeping as is)
    if (currentLesson && !completedLessons.includes(currentLesson.id)) {
      setCompletedLessons((prev) => [...prev, currentLesson.id]);
    }
    localStorage.setItem(`lastLesson-${subjectId}`, nextLesson.id);
    setCurrentLesson(nextLesson);
    // Scroll to top of content area
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextButtonClick = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }
    if (currentIndex >= 0 && currentIndex < flatLessons.length - 1) {
      handleNextLesson(flatLessons[currentIndex + 1]);
    }
  };

  const handleOpenChat = () => {
    if (!isLoggedIn) {
      setShowLoginModal(true);
    } else {
      setIsChatOpen(true);
    }
  };

  // ─── Loading State ─────────────────────────────────────────────────────────
  if (loading || authLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <div className="w-80 bg-white border-r border-gray-200 p-6 hidden md:block">
          <div className="h-6 w-3/4 bg-gray-200 rounded animate-pulse mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-full bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="w-full aspect-video bg-gray-200 rounded-xl animate-pulse" />
            <div className="h-8 w-2/3 bg-gray-200 rounded animate-pulse" />
            <div className="h-20 w-full bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // ─── Unauthenticated State ────────────────────────────────────────────────
  // Removed hard blocker to allow Preview Mode. Interaction is caught by the global interceptor.

  // ─── Error Handling ────────────────────────────────────────────────────────
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
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#f8fafc", overflow: "hidden" }}>

      {/* ── Sidebar ───────────────────────────────────────────────────────── */}
      <aside
        style={{
          width: 280,
          flexShrink: 0,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          background: "white",
          borderRight: "1px solid #f1f5f9",
          overflow: "hidden",
        }}
      >
        {/* Sidebar Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f1f5f9" }}>
          <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
            Course Content
          </p>
          {/* Step 3 — Gradient progress bar */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>{completedCount} of {totalLessons} complete</span>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#6366f1" }}>{progressPercent}%</span>
          </div>
          <div className="lesson-progress-bar">
            <div className="lesson-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Lesson List */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {sections.map((section) => (
            <div key={section.id} style={{ borderBottom: "1px solid #f8fafc" }}>
              {/* Section Label */}
              <p className="sidebar-section-title" style={{ padding: "0 16px 4px" }}>
                {section.title}
              </p>

              {/* Lesson Items */}
              <ul style={{ listStyle: "none", padding: "0 8px 8px", margin: 0 }}>
                {section.lessons.map((lesson) => {
                  const isCurrent = currentLesson?.id === lesson.id;
                  const isDone = completedLessons.includes(lesson.id);

                  return (
                    <li key={lesson.id}>
                      <button
                        className={`lesson-item${isCurrent ? " active" : ""}`}
                        onClick={() => handleLessonClick(lesson)}
                        data-protected="true"
                      >
                        {/* Status dot */}
                        <span style={{
                          flexShrink: 0,
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: isDone ? "#16a34a" : isCurrent ? "#2563eb" : "#e5e7eb",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          color: "white",
                          fontWeight: 700,
                        }}>
                          {isDone ? "✓" : null}
                        </span>
                        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {lesson.title}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main style={{ flex: 1, overflowY: "auto", background: "#f8fafc" }}>
        {!currentLesson ? (
          <LessonSkeleton />
        ) : (
          <div className="lesson-container">

            {/* Step 2 — Lesson Header */}
            <div className="lesson-header">
              <p className="lesson-meta">
                Lesson {currentIndex + 1} of {flatLessons.length}
                {currentLesson.isPreview && (
                  <span style={{
                    marginLeft: 10,
                    background: "#dbeafe",
                    color: "#2563eb",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "999px",
                  }}>
                    🔓 FREE PREVIEW
                  </span>
                )}
              </p>
              <h1 className="lesson-title">{currentLesson.title}</h1>
            </div>

            {/* Step 4 — Video Card */}
            <div className="lesson-video-card">
              {!currentLesson.videoUrl ? (
                <div style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  background: "#111827",
                  borderRadius: "12px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                }}>
                  <svg style={{ width: 48, height: 48, color: "#4b5563" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <p style={{ color: "#9ca3af", fontWeight: 500 }}>Video Unavailable</p>
                  <p style={{ color: "#6b7280", fontSize: "13px" }}>This lesson doesn&apos;t have a video yet.</p>
                </div>
              ) : (
                <div style={{ width: "100%", aspectRatio: "16/9", borderRadius: "12px", overflow: "hidden", background: "#000" }}>
                  <iframe
                    style={{ width: "100%", height: "100%", border: 0 }}
                    src={convertToEmbed(currentLesson.videoUrl)}
                    title={currentLesson.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>

            {/* Resume Banner */}
            {completedCount > 0 && completedCount < totalLessons && (
              <div style={{
                background: "#eff6ff",
                border: "1px solid #bfdbfe",
                borderRadius: "10px",
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "20px",
                gap: 12,
              }}>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#1d4ed8" }}>Resume where you left off</p>
                  <p style={{ fontSize: "12px", color: "#60a5fa", marginTop: 2 }}>Continue your learning journey</p>
                </div>
                <button
                  onClick={() => {
                    const firstIncomplete = flatLessons.find((l) => !completedLessons.includes(l.id));
                    if (firstIncomplete) handleLessonClick(firstIncomplete);
                  }}
                  style={{
                    background: "#2563eb", color: "white", border: "none",
                    borderRadius: "8px", padding: "8px 16px", cursor: "pointer",
                    fontSize: "13px", fontWeight: 600, whiteSpace: "nowrap",
                  }}
                  data-protected="true"
                >
                  Resume
                </button>
              </div>
            )}

            {/* Step 7 — AI Helper Card */}
            <div className="lesson-helper">
              <span className="lesson-helper-icon">🤖</span>
              <div className="lesson-helper-text">
                <strong>Have a doubt about this lesson?</strong>
                Ask the AI assistant — click the chat button in the bottom-right corner.
              </div>
            </div>

            {/* Feature 3 — AI Summary Panel */}
            {summaryText && (
              <div className="summary-box">
                <div className="summary-title">✨ Lesson Summary</div>
                <div className="summary-content">
                  {summaryText}
                </div>
                {/* Feature 4 — AI Quick Actions */}
                <div className="ai-action-grid">
                  <button
                    className="ai-action-button"
                    onClick={() => {
                      setSummaryLoading(true);
                      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://pathtopro-backend.onrender.com";
                      fetch(`${apiBase}/api/chatbot/message`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message: `Explain this in simpler terms: ${currentLesson.title}` }),
                      }).then(r => r.json()).then(data => {
                        setSummaryText(data?.data?.reply || data?.reply || summaryText);
                      }).catch(() => { }).finally(() => setSummaryLoading(false));
                    }}
                  >
                    Explain Simpler
                  </button>
                  <button
                    className="ai-action-button"
                    onClick={() => {
                      setSummaryLoading(true);
                      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://pathtopro-backend.onrender.com";
                      fetch(`${apiBase}/api/chatbot/message`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message: `Give interview tips for: ${currentLesson.title}` }),
                      }).then(r => r.json()).then(data => {
                        setSummaryText(data?.data?.reply || data?.reply || summaryText);
                      }).catch(() => { }).finally(() => setSummaryLoading(false));
                    }}
                  >
                    Give Interview Tips
                  </button>
                  <button
                    className="ai-action-button"
                    onClick={() => {
                      setSummaryLoading(true);
                      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://pathtopro-backend.onrender.com";
                      fetch(`${apiBase}/api/chatbot/message`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message: `Show real world example for: ${currentLesson.title}` }),
                      }).then(r => r.json()).then(data => {
                        setSummaryText(data?.data?.reply || data?.reply || summaryText);
                      }).catch(() => { }).finally(() => setSummaryLoading(false));
                    }}
                  >
                    Show Real World Example
                  </button>
                </div>
              </div>
            )}

            {/* Step 5 — Action Buttons */}
            <div className="lesson-actions">
              <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                <MarkCompleteButton
                  key={currentLesson.id}
                  lessonId={currentLesson.id}
                  initialCompleted={completedLessons.includes(currentLesson.id)}
                  onComplete={handleMarkComplete}
                  isAuthenticated={isLoggedIn}
                  onRequireAuth={() => setShowLoginModal(true)}
                />
                <button
                  className="generate-summary-btn"
                  disabled={summaryLoading}
                  onClick={async () => {
                    setSummaryLoading(true);
                    try {
                      const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://pathtopro-backend.onrender.com";
                      const res = await fetch(`${apiBase}/api/chatbot/message`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ message: `Give a short summary of: ${currentLesson.title}` }),
                      });
                      const data = await res.json();
                      setSummaryText(data?.data?.reply || data?.reply || "Summary not available.");
                    } catch {
                      setSummaryText("Could not generate summary. Try again later.");
                    } finally {
                      setSummaryLoading(false);
                    }
                  }}
                  data-protected="true"
                >
                  {summaryLoading ? "Generating..." : "✨ Generate AI Summary"}
                </button>
              </div>
              <div onClick={handleNextButtonClick}>
                <NextLessonButton
                  lessons={flatLessons}
                  currentLessonId={currentLesson.id}
                  onNext={handleNextLesson}
                  disabled={!isLoggedIn || currentIndex === flatLessons.length - 1}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Global Overlays */}
      <ChatFAB onClick={handleOpenChat} />
      <ChatbotOverlay open={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}

