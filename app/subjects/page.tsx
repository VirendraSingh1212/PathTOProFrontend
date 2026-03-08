"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, LayoutDashboard, Map, MessageSquare, HelpCircle, Settings, LogOut, User, Sparkles, ArrowRight, Flame, Clock, Trophy, Zap, Globe, Target, ArrowLeft } from "lucide-react";
import SubjectCard, { Subject } from "@/components/SubjectCard";
import DashboardView from "@/components/DashboardView";
import Typewriter from "@/components/Typewriter";
import ProtectedActionModal from "@/components/ProtectedActionModal";
import { useAuthStore } from "@/store/authStore";
import { API_BASE } from "@/utils/api";


const LOADING_MESSAGES = [
  "Preparing your learning workspace...",
  "Loading your courses...",
  "Almost ready...",
];

// --- GUEST DASHBOARD VIEW ---
function GuestDashboardView({ subjects, UPCOMING_SUBJECTS, handleSubjectClick, UPCOMING_COVERS, setActiveTab }: any) {
  return (
    <div className="space-y-12 pb-16">
      {/* ── TOP NAV / BACK BUTTON ── */}
      <div className="flex items-center animate-in fade-in slide-in-from-left duration-500 delay-100">
        <button
          onClick={() => window.location.href = '/'}
          className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors group"
        >
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
            <ArrowLeft size={16} />
          </div>
          Back to Home
        </button>
      </div>

      {/* ── PREMIUM HERO BANNER ── */}
      <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-blue-50 via-indigo-50/30 to-white px-8 py-12 lg:px-16 lg:py-20 border border-blue-100 shadow-xl shadow-blue-500/5 animate-in zoom-in-95 fade-in duration-700 delay-200">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] mb-8 shadow-lg shadow-blue-500/20">
            <Zap size={12} className="fill-current" /> NEW EXPERIENCE
          </div>
          <h1 className="text-4xl lg:text-6xl font-black mb-8 leading-[1.1] text-slate-900 tracking-tight">
            <Typewriter text="Oh! It seems you haven't joined the journey yet..." showCursor={false} speed={60} />
          </h1>
          <p className="text-slate-600 text-xl mb-10 leading-relaxed max-w-2xl font-medium">
            Unlock your potential with industry-standard roadmaps, real-world projects, and personalized learning tracks.
          </p>
          <div className="flex flex-wrap gap-5">
            <button
              onClick={() => window.location.href = '/auth/login'}
              className="bg-blue-600 text-white px-10 py-5 rounded-[24px] font-black text-lg flex items-center gap-3 hover:bg-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/30"
            >
              Start Learning Now <ArrowRight size={22} strokeWidth={3} />
            </button>
            <button
              onClick={() => window.location.href = '/auth/login'}
              className="bg-white/80 backdrop-blur-sm text-slate-900 px-10 py-5 rounded-[24px] font-black text-lg border-2 border-slate-100 hover:border-blue-200 hover:bg-white transition-all shadow-sm"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[140%] opacity-20 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full blur-[120px]" />
          <div className="absolute top-0 right-0 w-64 h-64 border-[40px] border-blue-500/10 rounded-full animate-pulse" />
        </div>
      </div>

      {/* ── HIGHLIGHTS SECTION ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-400">
        {[
          {
            title: "Structured Courses",
            desc: "Follow path designed by tech pros.",
            icon: <Target className="text-blue-500" />,
            bg: "bg-blue-50",
            onClick: () => setActiveTab("roadmap")
          },
          {
            title: "Track Progress",
            desc: "Always know where you are.",
            icon: <Globe className="text-emerald-500" />,
            bg: "bg-emerald-50",
            onClick: () => window.location.href = '/profile'
          },
          {
            title: "Smart Tracking",
            desc: "Unlock lessons progressively.",
            icon: <Sparkles className="text-purple-500" />,
            bg: "bg-purple-50",
            onClick: () => window.location.href = '/auth/login'
          }
        ].map((item, i) => (
          <div
            key={i}
            className="flex gap-5 p-4 rounded-3xl hover:bg-slate-50 transition-all duration-300 cursor-pointer group"
            onClick={item.onClick}
          >
            <div className={`w-14 h-14 rounded-2xl ${item.bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}>
              {React.cloneElement(item.icon as any, { size: 28 })}
            </div>
            <div>
              <h3 className="font-black text-slate-900 mb-1">{item.title}</h3>
              <p className="text-sm text-slate-500 leading-snug">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="h-px bg-slate-100 w-full animate-in fade-in duration-1000 delay-500" />

      {/* ── TEASER STATS (ANIMATED) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-600">
        {[
          { label: "Community Streak", value: "24k Users", icon: <Flame />, color: "orange" },
          { label: "Avg Study Time", value: "2.4h/Day", icon: <Clock />, color: "blue" },
          { label: "Certification", value: "Verified", icon: <Trophy />, color: "indigo" }
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-[28px] p-8 shadow-sm flex items-center gap-6 group relative overflow-hidden hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 transition-all duration-300">
            <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center shrink-0 ${stat.color === 'orange' ? 'bg-orange-50 text-orange-500 shadow-inner' :
              stat.color === 'blue' ? 'bg-blue-50 text-blue-500 shadow-inner' :
                'bg-indigo-50 text-indigo-500 shadow-inner'
              }`}>
              {React.cloneElement(stat.icon as any, { size: 32 })}
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1.5">{stat.label}</p>
              <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all">
              <Settings size={12} /> LOCKED
            </div>
          </div>
        ))}
      </div>

      {/* ── COURSE GRID LIBRARY ── */}
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-800">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Explore Course Library</h2>
            <p className="text-slate-500 mt-2 font-medium">Hand-picked interactive paths for your career.</p>
          </div>
          <button className="text-blue-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
            See All <ArrowRight size={18} />
          </button>
        </div>

        <div className="subject-grid">
          {subjects.map((subject: any, index: number) => {
            const FALLBACK_COVERS = [
              "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
              "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
            ];
            return (
              <div key={subject.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${900 + (index * 100)}ms` }}>
                <SubjectCard
                  subject={subject}
                  fallbackImage={FALLBACK_COVERS[index % FALLBACK_COVERS.length]}
                  onOpen={handleSubjectClick}
                />
              </div>
            );
          })}
          {UPCOMING_SUBJECTS.map((subject: any, index: number) => (
            <div key={subject.id} className="animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${1100 + (index * 100)}ms` }}>
              <SubjectCard
                subject={subject}
                fallbackImage={UPCOMING_COVERS[index % UPCOMING_COVERS.length]}
                onOpen={handleSubjectClick}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SubjectsPage() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as any) || "dashboard";
  const [activeTab, setActiveTab] = useState<"dashboard" | "courses" | "roadmap">(initialTab);

  // Sync tab with query param
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && (tabParam === "dashboard" || tabParam === "courses" || tabParam === "roadmap")) {
      setActiveTab(tabParam as any);
    }
  }, [searchParams]);

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
              <Typewriter text="PathToPro" speed={150} showCursor={false} />
            </div>
          </div>
        </div>

        {/* Quick Stats & Navigation */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <button
            className={`sidebar-item group ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <div className={`flex items-center gap-3 transition-transform duration-300 ${activeTab === 'dashboard' ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
              <LayoutDashboard size={18} strokeWidth={2} />
              Dashboard
            </div>
          </button>

          <button
            className={`sidebar-item group ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <div className={`flex items-center gap-3 transition-transform duration-300 ${activeTab === 'courses' ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
              <BookOpen size={18} strokeWidth={2} />
              Courses
            </div>
          </button>

          <button
            className={`sidebar-item group ${activeTab === 'roadmap' ? 'active' : ''}`}
            onClick={() => setActiveTab('roadmap')}
          >
            <div className={`flex items-center gap-3 transition-transform duration-300 ${activeTab === 'roadmap' ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>
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
      <main className="subjects-main overflow-hidden">
        <div
          key={activeTab}
          className="animate-in fade-in slide-in-from-right-4 duration-700 ease-out fill-mode-both"
          style={{ maxWidth: 1400, margin: "0 auto", paddingBottom: "80px" }}
        >

          {/* Title - Hidden when GuestDashboard is active (it has its own hero) */}
          {!(activeTab === "dashboard" && !isAuthenticated) && (
            <div style={{ marginBottom: "32px" }}>
              <h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "8px", color: "#111827", minHeight: "48px" }}>
                {activeTab === "roadmap" ? (
                  <Typewriter text="Learning Roadmap" showCursor={false} />
                ) : activeTab === "courses" ? (
                  <Typewriter text="Your Learning Path" showCursor={false} />
                ) : (
                  isAuthenticated ? (
                    <>
                      <Typewriter text={`Welcome back, ${user?.name?.split(' ')[0] || 'Student'} 👋`} showCursor={false} />
                    </>
                  ) : null
                )}
              </h1>
              <p style={{ fontSize: "15px", color: "#6b7280", maxWidth: "560px", lineHeight: 1.6 }}>
                {activeTab === "roadmap"
                  ? "Track your journey and see what's coming next in your curriculum."
                  : (isAuthenticated
                    ? "Continue your journey or explore new courses below."
                    : (activeTab === "courses" ? "Login or create an account to start your personalized learning journey and track your progress." : ""))}
              </p>
            </div>
          )}

          {(activeTab === "courses" || activeTab === "dashboard") ? (
            <>
              {/* Authenticated Dashboard */}
              {isAuthenticated && activeTab === "dashboard" && subjects.length > 0 && (
                <div className="mt-8">
                  <DashboardView user={user} subjects={subjects} />
                </div>
              )}

              {/* Guest Dashboard (New) */}
              {!isAuthenticated && activeTab === "dashboard" && (
                <GuestDashboardView
                  subjects={subjects}
                  UPCOMING_SUBJECTS={UPCOMING_SUBJECTS}
                  handleSubjectClick={handleSubjectClick}
                  UPCOMING_COVERS={UPCOMING_COVERS}
                  setActiveTab={setActiveTab}
                />
              )}

              {/* Subject Grid - Courses Tab only */}
              {activeTab === "courses" && (
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
          ) : (
            /* Refined Visual S-Curve Roadmap */
            <div className="roadmap-visual-container relative">
              <svg className="roadmap-svg-layer" viewBox="0 0 100 100" preserveAspectRatio="none">
                {allRoadmapItems.length > 1 && (() => {
                  // Waypoints for a smooth S-curve (0-100 values)
                  const waypoints = [
                    { x: 15, y: 18 }, { x: 50, y: 15 }, { x: 85, y: 18 },
                    { x: 80, y: 48 }, { x: 45, y: 52 }, { x: 15, y: 45 },
                    { x: 20, y: 78 }, { x: 55, y: 88 }, { x: 90, y: 82 },
                    { x: 85, y: 112 }, { x: 50, y: 122 }, { x: 20, y: 115 }
                  ];

                  const points = allRoadmapItems.map((_, i) => waypoints[i % waypoints.length]);

                  // Path calculation
                  let d = `M ${points[0].x} ${points[0].y}`;
                  for (let i = 0; i < points.length - 1; i++) {
                    const curr = points[i];
                    const next = points[i + 1];
                    // Control points for smooth winding
                    const cp1x = curr.x + (next.x - curr.x) / 2;
                    const cp2x = cp1x;
                    d += ` C ${cp1x} ${curr.y}, ${cp2x} ${next.y}, ${next.x} ${next.y}`;
                  }

                  return (
                    <>
                      <path d={d} className="roadmap-main-path" />
                      <path d={d} className="roadmap-progress-path" />
                    </>
                  );
                })()}
              </svg>

              <div className="relative z-10 w-full h-full min-h-[1000px]">
                {allRoadmapItems.map((item, i) => {
                  const waypoints = [
                    { x: 15, y: 18 }, { x: 50, y: 15 }, { x: 85, y: 18 },
                    { x: 80, y: 48 }, { x: 45, y: 52 }, { x: 15, y: 45 },
                    { x: 20, y: 78 }, { x: 55, y: 88 }, { x: 90, y: 82 },
                    { x: 85, y: 112 }, { x: 50, y: 122 }, { x: 20, y: 115 }
                  ];
                  const pos = waypoints[i % waypoints.length];

                  const isCompleted = item.status === "completed";
                  const isActive = item.status === "active";
                  const isUpcoming = item.status === "upcoming";

                  // Unified Theme Colors (Blue/Slate)
                  const primaryColor = "#3b82f6"; // Blue
                  const mutedColor = "#94a3b8";   // Slate-400
                  const nodeColor = isUpcoming ? mutedColor : primaryColor;

                  return (
                    <div
                      key={item.id}
                      className={`roadmap-node-wrapper node-status-${item.status} group`}
                      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    >
                      <div className="roadmap-node-circle"
                        style={{ borderColor: nodeColor, backgroundColor: (isActive || isCompleted) ? nodeColor : '#fff' }}
                        onClick={() => !isUpcoming && router.push(`/subjects/${item.id}`)}
                      >
                        <div className={`transition-transform duration-500 ${isUpcoming ? 'opacity-40' : 'group-hover:scale-125'}`}
                          style={{ color: (isActive || isCompleted) ? '#fff' : nodeColor }}>
                          {isCompleted ? <BookOpen size={32} strokeWidth={2.5} /> :
                            isActive ? <Map size={32} strokeWidth={2.5} /> :
                              <Settings size={28} strokeWidth={2} />}
                        </div>
                      </div>

                      <div className="roadmap-node-label transform transition-all duration-300 group-hover:translate-y-2">
                        <div className="node-title text-slate-900">{item.title}</div>
                        <div className="node-subtitle font-black" style={{ color: isUpcoming ? '#cbd5e1' : nodeColor }}>
                          {isCompleted ? "Mastered" : isActive ? "Learning Now" : "Coming Soon"}
                        </div>
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
