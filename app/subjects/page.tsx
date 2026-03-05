"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Subject = {
  id: string;
  title: string;
  description: string;
  progressPercent?: number;
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    async function fetchSubjects() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subjects`);
        const data = await res.json();
        setSubjects(data.data || []);
      } catch (err) {
        console.error("Failed to load subjects", err);
      }
    }

    fetchSubjects();
  }, []);

  const SUBJECT_COVERS: Record<string, string> = {
    "Full-Stack Development Masterclass": "/covers/fullstack.jpg",
    "System Design Fundamentals": "/covers/systemdesign.jpg",
    "Data Structures & Algorithms": "/covers/dsa.jpg",
  };

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
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                  }
                  alt={subject.title}
                  className="w-full h-40 object-cover"
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
        </div>
      </div>
    </div>
  );
}
