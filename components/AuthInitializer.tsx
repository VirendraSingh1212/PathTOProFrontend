"use client";

import { useEffect, useState } from "react";

/**
 * AuthInitializer ensures Zustand persist has time to rehydrate
 * auth state from localStorage before protected routes render.
 * 
 * This prevents hydration race conditions without polluting
 * the auth store with timing state.
 */
export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Allow Zustand persist middleware to complete rehydration
    // Using setTimeout(0) defers to next microtask, ensuring
    // localStorage read completes before rendering protected content
    const timer = setTimeout(() => {
      setReady(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}
