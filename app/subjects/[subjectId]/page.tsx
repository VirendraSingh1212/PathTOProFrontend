"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import apiClient from "@/lib/apiClient";
import { BookOpen } from "lucide-react";

interface Lesson {
  id: string;
  title: string;
  isPreview?: boolean;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export default function SubjectPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubjectTree() {
      try {
        setLoading(true);
        const response = await apiClient.get(`/subjects/${subjectId}/tree`);
        const sectionsData = response.data?.data?.sections || response.data || [];
        setSections(sectionsData);
      } catch (error) {
        console.error("Failed to load subject tree:", error);
        setSections([]);
      } finally {
        setLoading(false);
      }
    }

    if (subjectId) {
      loadSubjectTree();
    }
  }, [subjectId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-gray-500">Loading content...</p>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Subject ID: {subjectId}</h1>
      <p className="text-gray-500 mb-8">
        Browse through the course structure below.
      </p>

      {sections.length > 0 ? (
        <div className="course-content space-y-6">
          {sections.map((section) => (
            <div key={section.id} className="bg-white rounded-lg border p-6 shadow-sm">
              <h3 className="font-semibold text-xl text-gray-900 mb-4">{section.title}</h3>

              <ul className="mt-2 space-y-3">
                {section.lessons && section.lessons.map((lesson) => (
                  <li
                    key={lesson.id}
                    className="flex items-center gap-3 text-sm p-3 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-lg">
                      {lesson.isPreview ? "🔓" : "🔒"}
                    </span>
                    <span className="font-medium text-gray-700">{lesson.title}</span>
                    {lesson.isPreview && (
                      <span className="text-xs text-blue-600 ml-auto font-medium">Free Preview</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700">No Content Available</h2>
          <p className="text-gray-500 mt-2 max-w-md">
            Lessons for this subject have not been added yet. Check back later!
          </p>
        </div>
      )}
    </div>
  );
}
