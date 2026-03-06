"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

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

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  // Render immediately — no blocking, no blank screen
  return <>{children}</>;
}
