"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import SubjectCard, { Subject } from "@/components/SubjectCard";
import ProtectedActionModal from "@/components/ProtectedActionModal";
import { useAuthStore } from "@/store/authStore";

const LOADING_MESSAGES = [
  "Preparing your learning workspace...",
  "Loading your courses...",
  "Almost ready...",
];

export default function SubjectsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);

  // Rotate loading messages
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setLoadingMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        setLoading(true);
        const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pathtopro-backend.onrender.com/api';
        const cleanUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
        const apiUrl = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

        const res = await fetch(`${apiUrl}/subjects`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        const subjectData = data.data || data.subjects || data || [];
        const rawArray = Array.isArray(subjectData) ? subjectData : [];

        const normalized = rawArray.map(s => ({
          ...s,
          status: s.status || (s.is_preview ? "preview" : "available"),
          progressPercent: s.progressPercent || 0
        }));

        setSubjects(normalized);
        setError(null);
      } catch (err) {
        console.error("Failed to load subjects:", err);
        setError(err instanceof Error ? err.message : 'Failed to load subjects');
      } finally {
        setLoading(false);
      }
    }

    fetchSubjects();
  }, []);

  const handleSubjectClick = (subject: Subject) => {
    if (subject.status === "coming-soon") {
      setShowLoginModal(true);
      return;
    }
    if (!isAuthenticated && subject.status !== "preview") {
      setShowLoginModal(true);
      return;
    }
    router.push(`/subjects/${subject.id}`);
  };

  // ─── Branded Auth Loading Screen ─────────────────────────────────────
  if (loading) {
    return (
      <div className="auth-welcome">
        <div className="auth-logo">Path<span>To</span>Pro</div>
        <div className="auth-title">Welcome to PathToPro</div>
        <div className="auth-subtitle">{LOADING_MESSAGES[loadingMsgIndex]}</div>
        <div className="spinner" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="auth-welcome">
        <div className="auth-logo">Path<span>To</span>Pro</div>
        <div style={{ textAlign: "center", padding: "32px", maxWidth: 450 }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#dc2626", marginBottom: 8 }}>Error Loading Subjects</h2>
          <p style={{ color: "#6b7280", marginBottom: 16, lineHeight: 1.6 }}>{error}</p>
          <p style={{ fontSize: "13px", color: "#9ca3af", background: "#f9fafb", padding: 12, borderRadius: 8 }}>
            Please make sure the backend API is running and you have internet connection.
          </p>
        </div>
      </div>
    );
  }

  // Upcoming subjects
  const UPCOMING_SUBJECTS: Subject[] = [
    { id: "upcoming-ml", title: "Machine Learning", description: "ML fundamentals — regression, classification, neural networks.", status: "coming-soon", progressPercent: 0 },
    { id: "upcoming-devops", title: "DevOps Engineering", description: "CI/CD, Docker, Kubernetes, and infrastructure automation.", status: "coming-soon", progressPercent: 0 },
    { id: "upcoming-cloud", title: "Cloud Computing", description: "AWS, Azure, GCP — deploy, scale, and manage cloud infra.", status: "coming-soon", progressPercent: 0 },
    { id: "upcoming-cyber", title: "Cyber Security", description: "Network security, ethical hacking, threat analysis.", status: "coming-soon", progressPercent: 0 },
    { id: "upcoming-mobile", title: "Mobile App Development", description: "Cross-platform apps with React Native and Flutter.", status: "coming-soon", progressPercent: 0 },
    { id: "upcoming-ai", title: "AI Engineering", description: "Prompt engineering, LLM fine-tuning, RAG pipelines.", status: "coming-soon", progressPercent: 0 },
  ];

  const UPCOMING_COVERS = [
    "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&q=80",
    "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
    "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
  ];

  // Dashboard stats
  const coursesEnrolled = subjects.filter(s => (s.progressPercent || 0) > 0).length || subjects.length;
  const totalProgress = subjects.length > 0
    ? Math.round(subjects.reduce((sum, s) => sum + (s.progressPercent || 0), 0) / subjects.length)
    : 0;
  const lessonsCompleted = Math.round(totalProgress * 0.3);

  // Roadmap items for sidebar
  const allRoadmapItems = [
    ...subjects.map(s => ({ id: s.id, title: s.title, status: (s.progressPercent || 0) > 50 ? "completed" : "active" as string })),
    ...UPCOMING_SUBJECTS.map(s => ({ id: s.id, title: s.title, status: "upcoming" })),
  ];

  return (
    <div className="subjects-layout">

      {/* ── Left Sidebar ─────────────────────────────────────────────────── */}
      <aside className="subjects-sidebar">
        {/* Logo */}
        <div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "#111827" }}>
            Path<span style={{ color: "#2563eb" }}>To</span>Pro
          </div>
          <p style={{ fontSize: "11px", color: "#9ca3af", marginTop: 2 }}>Learning Platform</p>
        </div>

        {/* Quick Stats */}
        {isAuthenticated && subjects.length > 0 && (
          <div>
            <p className="sidebar-label">Overview</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#374151" }}>
                <span>Courses</span>
                <span style={{ fontWeight: 600 }}>{coursesEnrolled}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#374151" }}>
                <span>Completed</span>
                <span style={{ fontWeight: 600 }}>{lessonsCompleted}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#374151" }}>
                <span>Progress</span>
                <span style={{ fontWeight: 600, color: "#2563eb" }}>{totalProgress}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Learning Path - Roadmap */}
        <div>
          <p className="sidebar-label">Learning Path</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {allRoadmapItems.map((item) => {
              const isUpcoming = item.status === "upcoming";
              const dotClass = item.status === "completed" ? "green-dot" : item.status === "active" ? "blue-dot" : "gray-dot";

              return (
                <button
                  key={item.id}
                  className={`sidebar-item${isUpcoming ? " coming-soon" : ""}`}
                  onClick={() => {
                    if (!isUpcoming) {
                      const subj = subjects.find(s => s.id === item.id);
                      if (subj) handleSubjectClick(subj);
                    }
                  }}
                  title={isUpcoming ? "Coming soon — focus on current subjects." : item.title}
                >
                  <div className={dotClass} />
                  <div>
                    <div className="sidebar-item-title">{item.title}</div>
                    <div className="sidebar-item-badge">
                      {item.status === "completed" ? "✓ Completed" : item.status === "active" ? "In Progress" : "Coming Soon"}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Brand */}
        <div style={{ marginTop: "auto", fontSize: "12px", color: "#d1d5db", textAlign: "center" }}>
          #PathToPro
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="subjects-main">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>

          {/* Title */}
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "8px", color: "#111827" }}>
              {isAuthenticated ? "Welcome back 👋" : "Your Learning Paths"}
            </h1>
            <p style={{ fontSize: "15px", color: "#6b7280", maxWidth: "560px", lineHeight: 1.6 }}>
              {isAuthenticated
                ? "Continue your journey or explore new courses below."
                : "Select a subject below to start learning. Explore free previews or unlock full access."}
            </p>
          </div>

          {/* Dashboard */}
          {isAuthenticated && subjects.length > 0 && (
            <div className="dashboard-grid">
              <div className="dashboard-card">
                <div className="dashboard-icon" style={{ background: "#dbeafe" }}>📚</div>
                <div className="dashboard-title">Courses Enrolled</div>
                <div className="dashboard-number">{coursesEnrolled}</div>
              </div>
              <div className="dashboard-card">
                <div className="dashboard-icon" style={{ background: "#d1fae5" }}>✅</div>
                <div className="dashboard-title">Lessons Completed</div>
                <div className="dashboard-number">{lessonsCompleted}</div>
              </div>
              <div className="dashboard-card">
                <div className="dashboard-icon" style={{ background: "#ede9fe" }}>📊</div>
                <div className="dashboard-title">Total Progress</div>
                <div className="dashboard-number">{totalProgress}%</div>
              </div>
            </div>
          )}

          {/* Subject Cards */}
          {subjects.length === 0 && UPCOMING_SUBJECTS.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "80px 20px",
              background: "white", borderRadius: "16px",
              boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
            }}>
              <BookOpen style={{ margin: "0 auto 16px", width: 56, height: 56, color: "#d1d5db" }} />
              <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1f2937", marginBottom: "8px" }}>No Subjects Available</h3>
              <p style={{ color: "#9ca3af" }}>Check back later for new courses.</p>
            </div>
          ) : (
            <div className="subject-grid">
              {subjects.map((subject, index) => {
                const FALLBACK_COVERS = [
                  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
                  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
                  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
                ];
                return (
                  <SubjectCard
                    key={subject.id}
                    subject={subject}
                    fallbackImage={FALLBACK_COVERS[index % FALLBACK_COVERS.length]}
                    onOpen={handleSubjectClick}
                  />
                );
              })}
              {UPCOMING_SUBJECTS.map((subject, index) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  fallbackImage={UPCOMING_COVERS[index % UPCOMING_COVERS.length]}
                  onOpen={handleSubjectClick}
                />
              ))}
            </div>
          )}

          {/* Footer */}
          <div style={{
            textAlign: "center", marginTop: 48, padding: "24px 0",
            borderTop: "1px solid #e5e7eb", fontSize: "13px", color: "#9ca3af",
          }}>
            More courses coming soon — stay tuned for updates
          </div>
        </div>
      </main>

      <ProtectedActionModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Please log in to access this premium course content."
      />
    </div>
  );
}
