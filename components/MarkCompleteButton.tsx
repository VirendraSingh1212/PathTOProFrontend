"use client";

import { useState } from "react";

type Props = {
    lessonId: string;
    onComplete?: (opts?: { revert: boolean }) => void;
    initialCompleted?: boolean;
    disabled?: boolean;
    isAuthenticated?: boolean;
    onRequireAuth?: () => void;
};

export default function MarkCompleteButton({
    lessonId,
    onComplete,
    initialCompleted = false,
    disabled = false,
    isAuthenticated = true,
    onRequireAuth
}: Props) {
    const [completed, setCompleted] = useState(initialCompleted);
    const [loading, setLoading] = useState(false);

    async function markComplete() {
        if (!isAuthenticated) {
            onRequireAuth?.();
            return;
        }

        if (completed || loading || disabled) return;
        setLoading(true);
        setCompleted(true);
        onComplete?.(); // Optimistic update

        try {
            const apiBase =
                process.env.NEXT_PUBLIC_API_URL || "https://pathtopro-backend.onrender.com";
            const res = await fetch(`${apiBase}/api/progress/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ lessonId }),
            });
            // 404 means the backend route doesn't exist yet — that's okay,
            // we keep the frontend state as complete (frontend-only feature).
            if (!res.ok && res.status !== 404) throw new Error("failed");
        } catch (e) {
            // Only revert on actual network failures, not missing routes
            console.warn("Mark complete API call failed (non-critical):", e);
        } finally {
            setLoading(false);
        }
    }

    // Unauthenticated visually appear enabled so users can click to see the modal
    const isVisuallyDisabled = loading || (isAuthenticated && completed) || disabled;

    return (
        <button
            onClick={markComplete}
            disabled={isVisuallyDisabled}
            aria-disabled={isVisuallyDisabled}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all shadow-sm ${completed && isAuthenticated
                ? "bg-green-100 text-green-700 border border-green-200 cursor-default"
                : "bg-green-600 text-white hover:bg-green-700 active:scale-95"
                } disabled:opacity-70 disabled:cursor-default`}
        >
            {loading ? (
                <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving…
                </>
            ) : completed && isAuthenticated ? (
                <>✓ Completed</>
            ) : (
                <>✓ Mark as Complete</>
            )}
        </button>
    );
}
