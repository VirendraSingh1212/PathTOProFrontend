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

  return (
    <div className="learning-container">
      <div className="learning-inner">

        {/* Page Title */}
        <div style={{ marginBottom: "40px" }}>
          <h1 style={{
            fontSize: "36px",
            fontWeight: 700,
            marginBottom: "10px",
            color: "#111827"
          }}>
            Your Learning Paths
          </h1>
          <p style={{
            fontSize: "16px",
            color: "#6b7280",
            maxWidth: "600px",
            lineHeight: 1.6
          }}>
            Select a subject below to continue your journey. Explore free previews or unlock full access.
          </p>
        </div>

        {/* Subjects Grid */}
        {subjects.length === 0 ? (
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
          </div>
        )}
      </div>

      <ProtectedActionModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Please log in to access this premium course content."
      />
    </div>
  );
}
