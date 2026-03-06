"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import SubjectCard, { Subject } from "@/components/SubjectCard";
import ProtectedActionModal from "@/components/ProtectedActionModal";
import { useAuthStore } from "@/store/authStore";

export default function SubjectsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        setLoading(true);
        const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pathtopro-backend.onrender.com/api';
        const cleanUrl = rawUrl.endsWith('/') ? rawUrl.slice(0, -1) : rawUrl;
        const apiUrl = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`;

        console.log('Fetching subjects from:', `${apiUrl}/subjects`);

        const res = await fetch(`${apiUrl}/subjects`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log('Subjects response:', data);

        // Handle different response formats
        const subjectData = data.data || data.subjects || data || [];
        const rawArray = Array.isArray(subjectData) ? subjectData : [];

        // Normalize the payload to have a strictly defined status for the frontend UI.
        const normalized = rawArray.map(s => ({
          ...s,
          // Fallback sequence: Server Explicit Status -> is_preview flag -> Default Available
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
    // Edge case - user clicks "Coming soon", though card disables the button natively.
    if (subject.status === "coming-soon") {
      setShowLoginModal(true);
      return;
    }

    // Unauthenticated guest clicking a rigid available course.
    if (!isAuthenticated && subject.status !== "preview") {
      setShowLoginModal(true);
      return;
    }

    // Authenticated OR Preview routes -> proceed to slug
    router.push(`/subjects/${subject.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80')",
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
          <div className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            <p className="text-gray-800 font-medium">Loading subjects...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80')",
        }}
      >
        <div className="min-h-screen bg-white/95 backdrop-blur-md flex items-center justify-center">
          <div className="text-center p-8 bg-white shadow-2xl rounded-2xl max-w-md border border-red-100">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Subjects</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">{error}</p>
            <p className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
              Please make sure the backend API is running and you have internet connection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Hardcoded upcoming subjects for roadmap display
  const UPCOMING_SUBJECTS: Subject[] = [
    {
      id: "upcoming-ml",
      title: "Machine Learning",
      description: "Learn ML fundamentals — regression, classification, neural networks, and real-world applications.",
      status: "coming-soon",
      progressPercent: 0,
    },
    {
      id: "upcoming-devops",
      title: "DevOps Engineering",
      description: "Master CI/CD pipelines, Docker, Kubernetes, and infrastructure automation.",
      status: "coming-soon",
      progressPercent: 0,
    },
    {
      id: "upcoming-cloud",
      title: "Cloud Computing",
      description: "AWS, Azure, GCP essentials — deploy, scale, and manage cloud infrastructure.",
      status: "coming-soon",
      progressPercent: 0,
    },
    {
      id: "upcoming-cyber",
      title: "Cyber Security",
      description: "Network security, ethical hacking, threat analysis, and security best practices.",
      status: "coming-soon",
      progressPercent: 0,
    },
    {
      id: "upcoming-mobile",
      title: "Mobile App Development",
      description: "Build cross-platform apps with React Native and Flutter from scratch.",
      status: "coming-soon",
      progressPercent: 0,
    },
    {
      id: "upcoming-ai",
      title: "AI Engineering",
      description: "Prompt engineering, LLM fine-tuning, RAG pipelines, and AI-powered applications.",
      status: "coming-soon",
      progressPercent: 0,
    },
  ];

  const UPCOMING_COVERS = [
    "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=600&q=80",
    "https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=600&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=600&q=80",
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&q=80",
    "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&q=80",
  ];
  // Compute dashboard stats from existing data
  const coursesEnrolled = subjects.filter(s => (s.progressPercent || 0) > 0).length || subjects.length;
  const totalProgress = subjects.length > 0
    ? Math.round(subjects.reduce((sum, s) => sum + (s.progressPercent || 0), 0) / subjects.length)
    : 0;
  const lessonsCompleted = Math.round(totalProgress * 0.3); // approximate from progress

  // Combine all subjects for roadmap
  const allRoadmapItems = [
    ...subjects.map(s => ({ title: s.title, status: (s.progressPercent || 0) > 50 ? "completed" : "active" as string })),
    ...UPCOMING_SUBJECTS.map(s => ({ title: s.title, status: "upcoming" })),
  ];

  return (
    <div className="learning-container">
      <div className="learning-inner">

        {/* Page Title */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{
            fontSize: "36px",
            fontWeight: 700,
            marginBottom: "10px",
            color: "#111827"
          }}>
            {isAuthenticated ? "Welcome back 👋" : "Your Learning Paths"}
          </h1>
          <p style={{
            fontSize: "16px",
            color: "#6b7280",
            maxWidth: "600px",
            lineHeight: 1.6
          }}>
            {isAuthenticated
              ? "Continue your journey or explore new courses below."
              : "Select a subject below to continue your journey. Explore free previews or unlock full access."}
          </p>
        </div>

        {/* Feature 1 — Progress Dashboard */}
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

        {/* Subjects Grid — API subjects */}
        {subjects.length === 0 && UPCOMING_SUBJECTS.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "white",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
          }}>
            <BookOpen style={{ margin: "0 auto 16px", width: 56, height: 56, color: "#d1d5db" }} />
            <h3 style={{ fontSize: "20px", fontWeight: 700, color: "#1f2937", marginBottom: "8px" }}>No Subjects Available</h3>
            <p style={{ color: "#9ca3af" }}>Check back later for new courses.</p>
          </div>
        ) : (
          <div className="subject-grid">
            {/* Live subjects from API */}
            {subjects.map((subject, index) => {
              const FALLBACK_COVERS = [
                "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=80",
                "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&q=80",
                "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80",
              ];
              const fallbackImage = FALLBACK_COVERS[index % FALLBACK_COVERS.length];

              return (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  fallbackImage={fallbackImage}
                  onOpen={handleSubjectClick}
                />
              );
            })}

            {/* Upcoming "Coming Soon" subjects */}
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

        {/* Feature 2 — Learning Roadmap */}
        {allRoadmapItems.length > 0 && (
          <div className="roadmap-container">
            <h2 className="roadmap-header">🗺️ Learning Roadmap</h2>
            {allRoadmapItems.map((item, idx) => (
              <div key={item.title}>
                <div className={`roadmap-item ${item.status === "upcoming" ? "roadmap-upcoming" : ""}`}>
                  <div className={`roadmap-dot ${item.status}`} />
                  <div>
                    <div className="roadmap-title">
                      {item.title}
                      {item.status === "upcoming" && (
                        <span style={{ fontSize: "11px", color: "#9ca3af", marginLeft: 8, fontWeight: 400 }}>
                          Coming Soon
                        </span>
                      )}
                    </div>
                    <div className="roadmap-subtitle">
                      {item.status === "completed" ? "✓ Completed" : item.status === "active" ? "In Progress" : "Upcoming"}
                    </div>
                  </div>
                </div>
                {idx < allRoadmapItems.length - 1 && <div className="roadmap-line" />}
              </div>
            ))}
          </div>
        )}

        {/* Roadmap divider */}
        <div style={{
          textAlign: "center",
          marginTop: "20px",
          padding: "24px 0",
          borderTop: "1px solid #e5e7eb",
        }}>
          <p style={{ fontSize: "13px", color: "#9ca3af", letterSpacing: "0.06em" }}>
            More courses coming soon — stay tuned for updates
          </p>
        </div>
      </div>

      {/* Brand Footer */}
      <div style={{
        textAlign: "center",
        padding: "32px 0 24px",
        fontSize: "14px",
        color: "#9ca3af",
        letterSpacing: "0.5px",
      }}>
        #PathToPro
      </div>

      <ProtectedActionModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Please log in to access this premium course content."
      />
    </div>
  );
}
