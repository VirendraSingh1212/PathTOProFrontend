"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import usePreviewInterceptor from "@/hooks/usePreviewInterceptor";
import { initPreviewToast } from "@/utils/previewToast";

/**
 * AuthInitializer triggers session hydration from the backend on mount.
 * It does NOT block rendering — children render immediately and react
 * to auth state changes via Zustand once hydration completes.
 */
export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Initialize click interceptor (blocks interactions for unauthenticated users)
  usePreviewInterceptor(isAuthenticated);

  useEffect(() => {
    hydrateAuth();
    // Initialize the preview toast listener globally
    const cleanup = initPreviewToast();
    return cleanup;
  }, [hydrateAuth]);

  // Render immediately — no blocking, no blank screen
  return <>{children}</>;
}
