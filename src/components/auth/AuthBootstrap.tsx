"use client";

import { useEffect, useRef } from "react";
import { ApiError, apiGet, refreshAuthToken } from "@/lib/api";
import { useAuthStore, type User } from "@/store/auth";

export function AuthBootstrap() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasHydrated || hasRun.current) {
      return;
    }
    hasRun.current = true;

    const bootstrap = async () => {
      try {
        const user = await apiGet<User>("/auth/me");
        const current = useAuthStore.getState();
        current.login(user);
      } catch (error) {
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          const refreshed = await refreshAuthToken();
          if (!refreshed) {
            useAuthStore.getState().logout();
            return;
          }
          try {
            const user = await apiGet<User>("/auth/me");
            useAuthStore.getState().login(user);
          } catch {
            useAuthStore.getState().logout();
          }
        }
      }
    };

    void bootstrap();
  }, [hasHydrated]);

  return null;
}
