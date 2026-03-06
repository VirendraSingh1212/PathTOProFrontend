"use client";

import { useState } from "react";

type Props = {
    lessonId: string;
    onComplete?: (opts?: { revert: boolean }) => void;
    initialCompleted?: boolean;
    disabled?: boolean;
};

export default function MarkCompleteButton({ lessonId, onComplete, initialCompleted = false, disabled = false }: Props) {
    const [completed, setCompleted] = useState(initialCompleted);
    const [loading, setLoading] = useState(false);

    async function markComplete() {
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
            if (!res.ok) throw new Error("failed");
        } catch (e) {
            console.error(e);
            alert("Could not mark complete. Try again.");
            setCompleted(false);
            onComplete?.({ revert: true }); // Revert optimistic update
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={markComplete}
            disabled={loading || completed || disabled}
            aria-disabled={loading || completed || disabled}
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
