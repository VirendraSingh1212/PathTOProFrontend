"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, LayoutDashboard, Map, MessageSquare, HelpCircle, Settings, LogOut, User } from "lucide-react";
import SubjectCard, { Subject } from "@/components/SubjectCard";
import DashboardView from "@/components/DashboardView";
import ProtectedActionModal from "@/components/ProtectedActionModal";
import { useAuthStore } from "@/store/authStore";
import { API_BASE } from "@/utils/api";


const LOADING_MESSAGES = [
  "Preparing your learning workspace...",
  "Loading your courses...",
  "Almost ready...",
];

export default function SubjectsPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"dashboard" | "courses" | "roadmap">("dashboard");

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
        const res = await fetch(`${API_BASE}/subjects`);


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
      <aside className="subjects-sidebar flex flex-col justify-between">
        {/* Logo and Brand */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-white text-black p-1.5 rounded-lg flex items-center justify-center">
              <BookOpen size={20} strokeWidth={2.5} />
            </div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
              Path<span style={{ color: "#9ca3af" }}>To</span>Pro
            </div>
          </div>
        </div>

        {/* Quick Stats & Navigation */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <button
            className={`sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard size={18} strokeWidth={2} />
              Dashboard
            </div>
          </button>

          <button
            className={`sidebar-item ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <div className="flex items-center gap-3">
              <BookOpen size={18} strokeWidth={2} />
              Courses
            </div>
          </button>

          <button
            className={`sidebar-item ${activeTab === 'roadmap' ? 'active' : ''}`}
            onClick={() => setActiveTab('roadmap')}
          >
            <div className="flex items-center gap-3">
              <Map size={18} strokeWidth={2} />
              Learning Roadmap
            </div>
          </button>

          <button
            className="sidebar-item"
            onClick={() => {
              const btn = document.querySelector('button[aria-label="Open PathToPro chat assistant"]') as HTMLButtonElement | null;
              if (btn) btn.click();
            }}
          >
            <div className="flex items-center gap-3">
              <MessageSquare size={18} strokeWidth={2} />
              AI Assistant
            </div>
          </button>
        </div>

        {/* Bottom Options (Support & Settings) */}
        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 6, paddingBottom: "8px" }}>
          <button
            className="sidebar-item"
            onClick={() => router.push('/support')}
          >
            <div className="flex items-center gap-3">
              <HelpCircle size={18} strokeWidth={2} />
              Support
            </div>
          </button>

          <button
            className="sidebar-item"
            onClick={() => router.push('/profile')}
          >
            <div className="flex items-center gap-3">
              <Settings size={18} strokeWidth={2} />
              Profile Settings
            </div>
          </button>

          {/* User Profile */}
          {isAuthenticated && user && (
            <div className="mt-6 pt-6 border-t border-[#2d2d2d] flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-white font-bold text-sm shrink-0 border border-gray-600">
                {user.name ? user.name.charAt(0).toUpperCase() : <User size={16} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name || 'Student'}</p>
                <p className="text-xs text-gray-400 truncate">{user.email || 'Free Tier'}</p>
              </div>
              <button onClick={() => { logout(); router.push('/auth/login'); }} className="p-1.5 text-gray-400 hover:text-white rounded-md hover:bg-[#2d2d2d] transition-colors">
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <main className="subjects-main">
        <div style={{ maxWidth: 1400, margin: "0 auto", paddingBottom: "80px" }}>

          {/* Title */}
          <div style={{ marginBottom: "32px" }}>
            <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "8px", color: "#111827" }}>
              {activeTab === "roadmap" ? "Learning Roadmap" : (isAuthenticated ? "Welcome back 👋" : "Your Learning Paths")}
            </h1>
            <p style={{ fontSize: "15px", color: "#6b7280", maxWidth: "560px", lineHeight: 1.6 }}>
              {activeTab === "roadmap"
                ? "Track your journey and see what's coming next in your curriculum."
                : (isAuthenticated
                  ? "Continue your journey or explore new courses below."
                  : "Select a subject below to start learning. Explore free previews or unlock full access.")}
            </p>
          </div>

          {(activeTab === "courses" || activeTab === "dashboard") ? (
            <>
              {/* Dashboard */}
              {isAuthenticated && activeTab === "dashboard" && subjects.length > 0 && (
                <div className="mt-8">
                  <DashboardView user={user} subjects={subjects} />
                </div>
              )}

              {/* Subject Cards */}
              {activeTab === "courses" && (
                <>
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
                </>
              )}
            </>
          ) : (
            /* Roadmap Vertical Timeline */
            <div className="roadmap-container mt-8 bg-white/60 p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <div className="text-xs font-bold tracking-widest text-slate-400 mb-8 uppercase px-4 inline-block">
                Learning Path
              </div>
              <div className="relative border-l-2 border-gray-200 ml-[22px] py-2 space-y-12">
                {allRoadmapItems.map((item, index) => {
                  const isActive = item.status === "active" || item.status === "completed";
                  return (
                    <div key={item.id} className="relative group pl-10 cursor-pointer">
                      {/* Timeline Dot */}
                      <div className={`absolute top-4 left-[-9px] w-4 h-4 rounded-full border-4 border-white shadow-sm transition-all duration-300 group-hover:scale-125 group-hover:shadow-[0_0_12px_rgba(0,0,0,0.6)] ${isActive ? 'bg-black group-hover:bg-gray-800' : 'bg-gray-200 group-hover:bg-gray-300'}`} />

                      {/* Content */}
                      <div className="flex flex-col p-4 -mt-3 -ml-4 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:bg-white border border-transparent hover:border-gray-100">
                        <h3 className={`text-lg font-bold transition-colors ${isActive ? 'text-gray-900 group-hover:text-black' : 'text-gray-400 group-hover:text-gray-600'}`}>
                          {item.title}
                        </h3>
                        <p className={`text-sm mt-1 font-medium transition-colors ${isActive ? 'text-gray-500' : 'text-gray-300'}`}>
                          {item.status === "completed" ? "Completed" : item.status === "active" ? "In Progress" : "Coming Soon"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
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
