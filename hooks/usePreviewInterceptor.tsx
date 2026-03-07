// hooks/usePreviewInterceptor.tsx
import { useEffect } from "react";
import { useRouter } from "next/navigation"; // Changed from next/router to next/navigation for App Router

/**
 * usePreviewInterceptor
 * - When isAuthenticated === false: intercepts left-clicks (capture phase).
 * - For any clickable interactive element (anchors, buttons, role=button, elements with data-protected),
 *   prevents default behavior and redirects to /auth/login?next=<current path>
 * - Elements explicitly whitelisted for preview can include data-allow-preview="true".
 *
 * Usage: call usePreviewInterceptor(isAuthenticated) in your layout.
 */
export default function usePreviewInterceptor(isAuthenticated: boolean | null) {
    const router = useRouter();

    useEffect(() => {
        // If authenticated, do not intercept
        if (isAuthenticated) return;

        function handler(e: MouseEvent) {
            // Only left clicks
            if (e.button !== 0) return;

            const target = e.target as HTMLElement | null;
            if (!target) return;

            // Allow clicks on input/form elements and explicitly whitelisted links
            const allow = target.closest('[data-allow-preview="true"], input, textarea, select, form');
            if (allow) return;

            // Find clickable ancestor
            const clickable = target.closest('a[href], button, [role="button"], [data-protected], [data-click-intercept]');
            if (!clickable) return;

            // If it's an anchor with target _blank allow it optionally
            if ((clickable as HTMLAnchorElement).target === "_blank") return;

            // Prevent actual click action
            e.preventDefault();
            e.stopPropagation();

            // Fire preview toast event
            window.dispatchEvent(new CustomEvent("preview:require-login", {
                detail: { next: window.location.pathname + window.location.search }
            }));

            const next = encodeURIComponent(window.location.pathname + window.location.search);
            router.push(`/auth/login?next=${next}`);
        }

        document.addEventListener("click", handler, true); // capture phase
        return () => document.removeEventListener("click", handler, true);
    }, [isAuthenticated, router]);
}
