"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import ProtectedActionModal from "@/components/ProtectedActionModal";
import { useAuthStore } from "@/store/authStore";

/* ── Types ──────────────────────────────────────────────────────────── */

type SubjectStatus = "available" | "preview" | "coming-soon";

type Subject = {
  id: string;
  title: string;
  description: string;
  progressPercent?: number;
  thumbnail_url?: string;
  status?: SubjectStatus;
  is_preview?: boolean;
};

/* ── Constants ──────────────────────────────────────────────────────── */

const LOADING_MESSAGES = [
  "Preparing your learning workspace...",
  "Loading your courses...",
  "Almost ready...",
];

const UPCOMING_SUBJECTS: Subject[] = [
  { id: "upcoming-ml", title: "Machine Learning", description: "ML fundamentals — regression, classification, neural networks.", status: "coming-soon", progressPercent: 0 },
  { id: "upcoming-devops", title: "DevOps Engineering", description: "CI/CD, Docker, Kubernetes, and infrastructure automation.", status: "coming-soon", progressPercent: 0 },
  { id: "upcoming-cloud", title: "Cloud Computing", description: "AWS, Azure, GCP — deploy, scale, and manage cloud infra.", status: "coming-soon", progressPercent: 0 },
  { id: "upcoming-cyber", title: "Cyber Security", description: "Network security, ethical hacking, threat analysis.", status: "coming-soon", progressPercent: 0 },
  { id: "upcoming-mobile", title: "Mobile App Development", description: "Cross-platform apps with React Native and Flutter.", status: "coming-soon", progressPercent: 0 },
  { id: "upcoming-ai", title: "AI Engineering", description: "Prompt engineering, LLM fine-tuning, RAG pipelines.", status: "coming-soon", progressPercent: 0 },
];

const FALLBACK_COVERS = [
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
];

const UPCOMING_COVERS = [
  "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&q=80",
  "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
  "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
  "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
];

const SUBJECT_COVERS: Record<string, string> = {
  "Full-Stack Development Masterclass": "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
  "System Design Fundamentals": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
  "Data Structures & Algorithms": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
};

/* ── Skeleton Component ─────────────────────────────────────────────── */

function SkeletonCards({ count }: { count: number }) {
  return (
    <div className="ds-course-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ds-skeleton-card">
          <div className="ds-skeleton ds-skeleton-img" />
          <div className="ds-skeleton-body">
            <div className="ds-skeleton ds-skeleton-line w-3/4" />
            <div className="ds-skeleton ds-skeleton-line w-full" />
            <div className="ds-skeleton ds-skeleton-line w-1/2" />
            <div className="ds-skeleton ds-skeleton-bar" />
            <div className="ds-skeleton ds-skeleton-btn" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────────────────── */

export default function SubjectsPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
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

  // Fetch subjects — IDENTICAL to original
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

        const normalized = rawArray.map((s: Subject) => ({
          ...s,
          status: s.status || (s.is_preview ? "preview" : "available"),
          progressPercent: s.progressPercent || 0,
        }));

        setSubjects(normalized);
        setError(null);
      } catch (err) {
        console.error("Failed to load subjects:", err);
        setError(err instanceof Error ? err.message : "Failed to load subjects");
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

  // Dashboard stats
  const coursesEnrolled = subjects.filter((s) => (s.progressPercent || 0) > 0).length || subjects.length;
  const totalProgress = subjects.length > 0
    ? Math.round(subjects.reduce((sum, s) => sum + (s.progressPercent || 0), 0) / subjects.length)
    : 0;
  const lessonsCompleted = Math.round(totalProgress * 0.3);

  // ── Loading Screen ─────────────────────────────────────────────────────
  if (loading) {
    return (
      <DashboardLayout>
        <div className="ds-welcome">
          <h1>Loading...</h1>
          <p>{LOADING_MESSAGES[loadingMsgIndex]}</p>
        </div>
        <SkeletonCards count={6} />
      </DashboardLayout>
    );
  }

  // ── Error Screen ───────────────────────────────────────────────────────
  if (error) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#dc2626", marginBottom: 8 }}>
            Error Loading Subjects
          </h2>
          <p style={{ color: "#6b7280", marginBottom: 16, lineHeight: 1.6 }}>{error}</p>
          <p style={{ fontSize: "13px", color: "#9ca3af", background: "#f9fafb", padding: 12, borderRadius: 8, display: "inline-block" }}>
            Please make sure the backend API is running and you have internet connection.
          </p>
        </div>
      </DashboardLayout>
    );
  }

  // ── Main Dashboard ─────────────────────────────────────────────────────
  const getCover = (subject: Subject, index: number, isComing = false) => {
    if (isComing) return UPCOMING_COVERS[index % UPCOMING_COVERS.length];
    return SUBJECT_COVERS[subject.title] ?? subject.thumbnail_url ?? FALLBACK_COVERS[index % FALLBACK_COVERS.length];
  };

  return (
    <DashboardLayout>
      {/* ── Welcome Section ─────────────────────────────────────────── */}
      <div className="ds-welcome">
        <h1>
          {isAuthenticated ? `Welcome back, ${user?.name?.split(" ")[0] || "Student"} 👋` : "Your Learning Dashboard"}
        </h1>
        <p>
          {isAuthenticated
            ? "Continue your learning journey."
            : "Select a subject below to start learning."}
        </p>
        {isAuthenticated && (
          <div className="ds-streak">🔥 3 Day Learning Streak</div>
        )}
      </div>

      {/* ── Stats Row ───────────────────────────────────────────────── */}
      {isAuthenticated && subjects.length > 0 && (
        <div className="ds-stats-row">
          <div className="ds-stat-card">
            <div className="ds-stat-icon" style={{ background: "#dbeafe" }}>📚</div>
            <div>
              <div className="ds-stat-label">Courses Enrolled</div>
              <div className="ds-stat-value">{coursesEnrolled}</div>
            </div>
          </div>
          <div className="ds-stat-card">
            <div className="ds-stat-icon" style={{ background: "#d1fae5" }}>✅</div>
            <div>
              <div className="ds-stat-label">Lessons Completed</div>
              <div className="ds-stat-value">{lessonsCompleted}</div>
            </div>
          </div>
          <div className="ds-stat-card">
            <div className="ds-stat-icon" style={{ background: "#ede9fe" }}>📊</div>
            <div>
              <div className="ds-stat-label">Total Progress</div>
              <div className="ds-stat-value">{totalProgress}%</div>
            </div>
          </div>
        </div>
      )}

      {/* ── Continue Learning Card ──────────────────────────────────── */}
      {isAuthenticated && subjects.length > 0 && (
        <div className="ds-continue-card">
          <div className="ds-continue-label">Continue Learning</div>
          <div className="ds-continue-title">
            {subjects[0]?.title || "Full-Stack Development Masterclass"}
          </div>
          <div className="ds-continue-sub">
            Lesson {Math.max(1, lessonsCompleted)} of {Math.max(21, subjects.length * 7)}
          </div>
          <div className="ds-continue-progress">
            <span>Course Progress</span>
            <span>{totalProgress}%</span>
          </div>
          <div className="ds-continue-bar">
            <div className="ds-continue-bar-fill" style={{ width: `${totalProgress}%` }} />
          </div>
          <button
            className="ds-resume-btn"
            onClick={() => subjects[0] && handleSubjectClick(subjects[0])}
          >
            Resume Lesson →
          </button>
        </div>
      )}

      {/* ── Course Grid ─────────────────────────────────────────────── */}
      {subjects.length === 0 && UPCOMING_SUBJECTS.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "80px 20px",
          background: "white", borderRadius: "16px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
        }}>
          <BookOpen style={{ margin: "0 auto 16px", width: 56, height: 56, color: "#d1d5db" }} />
          <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1f2937", marginBottom: "8px" }}>
            No Subjects Available
          </h3>
          <p style={{ color: "#9ca3af" }}>Check back later for new courses.</p>
        </div>
      ) : (
        <>
          <h2 className="ds-section-title">Your Courses</h2>
          <div className="ds-course-grid">
            {subjects.map((subject, index) => {
              const disabled = subject.status === "coming-soon";
              const coverSrc = getCover(subject, index);

              return (
                <div key={subject.id} className="ds-course-card">
                  {/* Preview Badge */}
                  {subject.status === "preview" && (
                    <div className="ds-badge-preview">FREE PREVIEW</div>
                  )}

                  {/* Cover Image */}
                  <img
                    src={coverSrc}
                    alt={subject.title}
                    onError={(e) => { e.currentTarget.src = FALLBACK_COVERS[index % FALLBACK_COVERS.length]; }}
                  />

                  {/* Body */}
                  <div className="ds-course-card-body">
                    <div className="ds-course-card-title">{subject.title}</div>
                    <div className="ds-course-card-desc">{subject.description}</div>

                    <div className="ds-course-card-progress-label">Progress</div>
                    <div className="ds-course-card-bar">
                      <div
                        className="ds-course-card-bar-fill"
                        style={{ width: `${subject.progressPercent || 0}%` }}
                      />
                    </div>

                    <button
                      className="ds-course-card-btn"
                      disabled={disabled}
                      onClick={() => !disabled && handleSubjectClick(subject)}
                    >
                      {subject.status === "preview" ? "Preview Course" : "Continue Learning"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Upcoming Courses ───────────────────────────────────── */}
          {UPCOMING_SUBJECTS.length > 0 && (
            <>
              <h2 className="ds-section-title">Upcoming Courses</h2>
              <div className="ds-course-grid">
                {UPCOMING_SUBJECTS.map((subject, index) => (
                  <div
                    key={subject.id}
                    className="ds-course-card"
                    style={{ opacity: 0.85 }}
                  >
                    {/* Coming Soon Tag */}
                    <div className="ds-coming-tag">Coming Soon</div>

                    {/* Hover Overlay */}
                    <div className="ds-coming-overlay">
                      <div className="ds-coming-overlay-text">Coming Soon</div>
                    </div>

                    {/* Cover Image */}
                    <img
                      src={getCover(subject, index, true)}
                      alt={subject.title}
                    />

                    {/* Body */}
                    <div className="ds-course-card-body">
                      <div className="ds-course-card-title">{subject.title}</div>
                      <div className="ds-course-card-desc">{subject.description}</div>

                      <button className="ds-course-card-btn" disabled>
                        Coming Soon
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <div className="ds-footer">
        More courses coming soon — stay tuned for updates
      </div>

      {/* ── Login Modal ─────────────────────────────────────────────── */}
      <ProtectedActionModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Please log in to access this premium course content."
      />
    </DashboardLayout>
  );
}
