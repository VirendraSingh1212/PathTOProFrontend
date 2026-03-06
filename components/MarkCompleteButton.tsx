"use client";

import { useState } from "react";

type Props = {
    lessonId: string;
    /** Called after the lesson is marked complete */
    onComplete?: () => void;
    /** Pre-seeded completed state (e.g. from parent) */
    initialCompleted?: boolean;
};

export default function MarkCompleteButton({ lessonId, onComplete, initialCompleted = false }: Props) {
    const [completed, setCompleted] = useState(initialCompleted);
    const [loading, setLoading] = useState(false);

    async function markComplete() {
        if (completed || loading) return;
        setLoading(true);

        try {
            const apiBase =
                process.env.NEXT_PUBLIC_API_BASE_URL || "https://pathtopro-backend.onrender.com/api";
            await fetch(`${apiBase}/progress/lessons/${lessonId}/complete`, {
                method: "POST",
                credentials: "include",
            });
            setCompleted(true);
            onComplete?.();
        } catch {
            // Optimistic update: still mark complete locally even if API call fails
            setCompleted(true);
            onComplete?.();
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={markComplete}
            disabled={loading || completed}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm ${completed
                    ? "bg-green-100 text-green-700 border border-green-200 cursor-default"
                    : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
                } disabled:opacity-70 disabled:cursor-default`}
        >
            {loading ? (
                <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving…
                </>
            ) : completed ? (
                <>✓ Completed</>
            ) : (
                <>✓ Mark as Complete</>
            )}
        </button>
    );
}
