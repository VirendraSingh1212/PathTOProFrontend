"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";

type Subject = {
  id: string;
  title: string;
  description: string;
  progressPercent?: number;
  thumbnail_url?: string;
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        setLoading(true);
        // Use the correct env variable name
        const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pathtopro-backend.onrender.com/api';
        
        console.log('Fetching subjects from:', `${apiUrl}/subjects`);
        
        const res = await fetch(`${apiUrl}/subjects`);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log('Subjects response:', data);
        
        // Handle different response formats
        const subjectData = data.data || data.subjects || data || [];
        setSubjects(Array.isArray(subjectData) ? subjectData : []);
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

  const SUBJECT_COVERS: Record<string, string> = {
    "Full-Stack Development Masterclass": "/covers/fullstack.jpg",
    "System Design Fundamentals": "/covers/systemdesign.jpg",
    "Data Structures & Algorithms": "/covers/dsa.jpg",
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c')",
        }}
      >
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg">
          <p className="text-gray-600 text-lg">Loading subjects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c')",
        }}
      >
        <div className="min-h-screen bg-white/90 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Subjects</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">
              Please make sure the backend API is running and you have internet connection.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519389950473-47ba0277781c')",
      }}
    >
      <div className="min-h-screen bg-white/90 backdrop-blur-sm">

        <div className="max-w-6xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-gray-800">
              Your Subjects
            </h1>

            <p className="text-gray-500 mt-2">
              Select a subject to continue learning.
            </p>
          </div>

          {/* Subjects Grid */}
          {subjects.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="mx-auto h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Subjects Available</h3>
              <p className="text-gray-500">Check back later for new courses.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {subjects.map((subject) => (
                <div
                  key={subject.id}
                  className="bg-white rounded-xl shadow-sm border hover:shadow-lg transition transform hover:-translate-y-1 overflow-hidden"
                >
                  {/* Cover Image */}
                  <img
                    src={
                      SUBJECT_COVERS[subject.title] ??
                      subject.thumbnail_url ??
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                    }
                    alt={subject.title}
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3";
                    }}
                  />

                  {/* Content */}
                  <div className="p-5">

                    <h2 className="text-lg font-semibold text-gray-800">
                      {subject.title}
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                      {subject.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4">

                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${subject.progressPercent ?? 0}%`,
                          }}
                        />
                      </div>

                      <p className="text-xs text-gray-500 mt-1">
                        {subject.progressPercent ?? 0}% completed
                      </p>
                    </div>

                    {/* Button */}
                    <Link
                      href={`/subjects/${subject.id}`}
                      className="inline-block mt-4 text-blue-600 font-medium hover:underline"
                    >
                      Continue Learning →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
