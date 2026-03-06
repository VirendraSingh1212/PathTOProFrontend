"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";

/**
 * AuthInitializer protects routes by properly hydrating from backend OR local storage
 */
export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  const hydrateAuth = useAuthStore((state) => state.hydrateAuth);

  useEffect(() => {
    // Single hydration point across the whole app
    hydrateAuth().finally(() => {
      setReady(true);
    });
  }, [hydrateAuth]);

  if (!ready) {
    // Global hydration takes precedence. Protects against UI flash.
    return null;
  }

  return <>{children}</>;
}
