"use client";

import { useParams } from "next/navigation";

export default function SubjectPage() {
  const params = useParams();
  const subjectId = params.subjectId as string;

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Subject ID: {subjectId}</h1>
      <p className="text-gray-500 mt-2">
        This subject page will load sections, videos, and sidebar content.
      </p>
    </div>
  );
}
