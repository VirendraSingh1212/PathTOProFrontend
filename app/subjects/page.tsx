"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";
import SubjectCard, { Subject } from "@/components/SubjectCard";
import ProtectedActionModal from "@/components/ProtectedActionModal";
import { useAuthStore } from "@/store/authStore";

export default function SubjectsPage() {
  const router = useRouter();
  const { isAuthenticated, authLoading } = useAuthStore();
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

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/images/hero-bg.jpg')",
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
          backgroundImage: "url('/images/hero-bg.jpg')",
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
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('/images/hero-bg.jpg')"
      }}
    >
      <div className="min-h-screen bg-white/85 backdrop-blur-[2px]">

        <div className="max-w-6xl mx-auto px-6 py-12 md:py-20">

          {/* Header */}
          <div className="mb-12 text-center md:text-left">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Your Learning Paths
            </h1>
            <p className="text-lg text-gray-600 mt-3 max-w-2xl">
              Select a subject below to continue your journey. Explore free previews or unlock full access.
            </p>
          </div>

          {/* Subjects Grid */}
          {subjects.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">No Subjects Available</h3>
              <p className="text-gray-500">Check back later for new courses.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {subjects.map((subject, index) => {
                const FALLBACK_COVERS = [
                  "https://images.unsplash.com/photo-1498050108023-c5249f4df085", // Web / laptop
                  "https://images.unsplash.com/photo-1504384308090-c894fdcc538d", // System design / diagram
                  "https://images.unsplash.com/photo-1551288049-bebda4e38f71", // Algorithms / abstract
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
      </div>

      <ProtectedActionModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        message="Please log in to access this premium course content."
      />
    </div>
  );
}
