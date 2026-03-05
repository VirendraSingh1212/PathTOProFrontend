'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import apiClient from '@/lib/apiClient';
import { Spinner } from '@/components/common/Spinner';
import { BookOpen } from 'lucide-react';

interface Subject {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
}

// Cover image mapping
const covers: Record<string, string> = {
  "Full-Stack Development Masterclass": "/covers/fullstack.jpg",
  "System Design Fundamentals": "/covers/systemdesign.jpg",
  "Data Structures & Algorithms": "/covers/dsa.jpg",
};

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/subjects');
        
        // Backend returns { success: true, data: [...] }
        const subjectData = res.data.data || res.data || [];
        setSubjects(Array.isArray(subjectData) ? subjectData : []);
        setError(null);
      } catch (err) {
        console.error('Failed to load subjects:', err);
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || 'Failed to load subjects');
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Spinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500">
        <h2 className="text-xl font-semibold mb-2">Error Loading Subjects</h2>
        <p>{error}</p>
        <p className="mt-4 text-sm text-gray-600">
          Make sure you're logged in and the backend API is running.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-2">Your Subjects</h1>
      <p className="text-gray-500 mb-8">
        Select a subject to continue learning.
      </p>

      {subjects.length === 0 ? (
        <div className="text-center py-12 border rounded-lg bg-white">
          <BookOpen className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">No subjects available</h3>
          <p className="mt-1 text-sm text-gray-500">Check back later for new courses.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {subjects.map((subject) => {
            // Use custom cover image or fallback to thumbnail or default
            const customCover = covers[subject.title];
            const imageUrl = customCover || subject.thumbnail_url || "/covers/default.jpg";
            
            return (
              <div
                key={subject.id}
                className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
              >
                <div className="w-full h-40 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
                  <img
                    src={imageUrl}
                    alt={subject.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback to gradient if image fails
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                          <svg class="h-10 w-10 text-blue-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                      `;
                    }}
                  />
                </div>

                <div className="p-5">
                  <h2 className="font-semibold text-lg mb-2">
                    {subject.title}
                  </h2>

                  <p className="text-gray-500 text-sm mb-4">
                    {subject.description}
                  </p>

                  <Link
                    href={`/subjects/${subject.id}`}
                    className="text-blue-600 font-medium hover:underline inline-block"
                  >
                    Continue Learning →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
