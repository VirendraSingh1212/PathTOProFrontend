"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Play, Sparkles, MessageCircle } from "lucide-react";
import { convertToEmbed } from "@/utils/youtube";
import LessonSkeleton from "@/components/LessonSkeleton";
import MarkCompleteButton from "@/components/MarkCompleteButton";
import NextLessonButton from "@/components/NextLessonButton";
import LoginModal from "@/components/LoginModal";
import { useAuthStore } from "@/store/authStore";
import { ENDPOINTS } from "@/utils/api";


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
  const router = useRouter();
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
        const res = await fetch(ENDPOINTS.SUBJECTS(subjectId), {
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
    // Mark current lesson complete when navigating forward
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
      window.dispatchEvent(new CustomEvent("open-chatbot"));
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
  if (!isLoggedIn) {
    return (
      <div className="flex h-screen bg-gray-50 items-center justify-center">
        <LoginModal open={true} onClose={() => { }} />
      </div>
    );
  }

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
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f1f5f9" }} className="animate-in fade-in slide-in-from-left-4 duration-500">
          <button
            onClick={() => router.push('/subjects')}
            className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 group transition-colors"
          >
            <div className="p-1.5 rounded-full border border-gray-100 group-hover:bg-gray-50 transition-colors">
              <ArrowLeft size={14} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider">Back to Dashboard</span>
          </button>

          <p style={{ fontSize: "11px", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "10px" }}>
            Course Content
          </p>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>{completedCount} of {totalLessons} complete</span>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "black" }}>{progressPercent}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-black transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Lesson List */}
        <div style={{ flex: 1, overflowY: "auto" }} className="animate-in fade-in slide-in-from-left-6 duration-700 delay-200 fill-mode-both">
          {sections.map((section) => (
            <div key={section.id} style={{ borderBottom: "1px solid #f8fafc" }}>
              <p style={{ padding: "16px 16px 4px", fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {section.title}
              </p>

              <ul style={{ listStyle: "none", padding: "0 8px 12px", margin: 0 }}>
                {section.lessons.map((lesson) => {
                  const isCurrent = currentLesson?.id === lesson.id;
                  const isDone = completedLessons.includes(lesson.id);

                  return (
                    <li key={lesson.id}>
                      <button
                        className={`w-full text-left flex items-center gap-3 p-2.5 rounded-lg transition-all ${isCurrent ? "bg-gray-100 font-bold" : "hover:bg-gray-50 text-gray-600"}`}
                        onClick={() => handleLessonClick(lesson)}
                      >
                        <div style={{
                          flexShrink: 0,
                          width: 20,
                          height: 20,
                          borderRadius: "50%",
                          background: isDone ? "#111827" : isCurrent ? "#000000" : "transparent",
                          border: isDone || isCurrent ? "none" : "2px solid #e2e8f0",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.2s ease"
                        }}>
                          {isDone ? <CheckCircle2 size={12} className="text-white" /> : null}
                          {isCurrent && !isDone ? <div className="w-1.5 h-1.5 bg-white rounded-full" /> : null}
                        </div>
                        <span style={{ flex: 1, fontSize: '13px', overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
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
          <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 20px" }}>

            {/* Lesson Header */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" style={{ animationDelay: '100ms' }}>
              <p className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Lesson {currentIndex + 1} of {flatLessons.length}</span>
                {currentLesson.isPreview && (
                  <span className="bg-gray-100 text-black text-[10px] font-extrabold px-2 py-0.5 rounded tracking-tighter">
                    FREE PREVIEW
                  </span>
                )}
              </p>
              <h1 className="font-black text-3xl mt-2 text-black tracking-tight">{currentLesson.title}</h1>
            </div>

            {/* Video Card */}
            <div className="animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both overflow-hidden rounded-2xl border border-gray-100 shadow-xl" style={{ animationDelay: '300ms', marginTop: '32px' }}>
              {!currentLesson.videoUrl ? (
                <div style={{
                  width: "100%",
                  aspectRatio: "16/9",
                  background: "#111827",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                }}>
                  <Play className="w-12 h-12 text-gray-700" strokeWidth={1} />
                  <p style={{ color: "#9ca3af", fontWeight: 700, fontSize: '14px' }}>Video Content Empty</p>
                </div>
              ) : (
                <div style={{ width: "100%", aspectRatio: "16/9", background: "#000" }}>
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

            {/* AI Helper Card */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both bg-gray-50 border border-gray-100 p-6 rounded-2xl flex flex-col md:flex-row gap-5 items-center mt-12" style={{ animationDelay: '500ms' }}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center shrink-0">
                  <Sparkles className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="font-bold text-black text-sm">Need deep clarification?</p>
                  <p className="text-gray-500 text-xs mt-1">Ask our specialized AI Assistant for context-aware explanations.</p>
                </div>
              </div>
              <button
                onClick={handleOpenChat}
                className="md:ml-auto w-full md:w-auto bg-black text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
              >
                <MessageCircle size={14} /> Open AI Assistant
              </button>
            </div>

            {/* AI Summary Panel */}
            {summaryText && (
              <div className="mt-8 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-gray-400" />
                  <span className="font-bold text-sm tracking-tight text-gray-900 uppercase tracking-widest text-[10px]">Lesson Summary</span>
                </div>
                <div className="text-sm text-gray-600 leading-relaxed font-medium">
                  {summaryText}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both border-t border-gray-100 pt-10 mt-10 mb-20 flex flex-col md:flex-row gap-6 md:items-center justify-between" style={{ animationDelay: '700ms' }}>
              <div className="flex flex-wrap gap-3 items-center">
                <MarkCompleteButton
                  key={currentLesson.id}
                  lessonId={currentLesson.id}
                  initialCompleted={completedLessons.includes(currentLesson.id)}
                  onComplete={handleMarkComplete}
                  isAuthenticated={isLoggedIn}
                  onRequireAuth={() => setShowLoginModal(true)}
                />
                <button
                  className="flex items-center gap-2 bg-white border border-gray-200 text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50 shadow-sm"
                  disabled={summaryLoading}
                  onClick={async () => {
                    setSummaryLoading(true);
                    try {
                      const { accessToken } = useAuthStore.getState();
                      const res = await fetch(ENDPOINTS.CHATBOT, {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          ...(accessToken && { "Authorization": `Bearer ${accessToken}` })
                        },
                        credentials: "include",
                        body: JSON.stringify({ message: `Give a short summary of: ${currentLesson.title}` }),
                      });

                      if (!res.ok) throw new Error(`HTTP ${res.status}`);

                      const data = await res.json();
                      const reply = data?.data?.reply || data?.reply;

                      // Check for the backend's fallback string
                      if (reply && reply.toLowerCase().includes("service is temporarily unavailable")) {
                        setSummaryText("The AI summary service is currently deep in thought. Please try again in a moment.");
                      } else {
                        setSummaryText(reply || "Summary not available at the moment.");
                      }
                    } catch (err) {
                      setSummaryText(`Oops! Connection issue (${err instanceof Error ? err.message : 'Error'}). Please try again.`);
                    } finally {
                      setSummaryLoading(false);
                    }
                  }}
                >
                  {summaryLoading ? "Analyzing..." : <><Sparkles size={16} /> AI Summary</>}
                </button>
              </div>

              <div className="flex items-center gap-4">
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
      <LoginModal open={showLoginModal} onClose={() => setShowLoginModal(false)} />
    </div>
  );
}

