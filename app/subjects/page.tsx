'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
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

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/subjects');
        console.log('Subjects response:', res.data);
        
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
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition"
            >
              {subject.thumbnail_url ? (
                <img
                  src={subject.thumbnail_url}
                  alt={subject.title}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-blue-200" />
                </div>
              )}

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
          ))}
        </div>
      )}
    </div>
  );
}
