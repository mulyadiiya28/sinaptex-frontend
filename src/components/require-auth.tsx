"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/use-session-store";
import { useMe } from "@/features/auth/auth.hooks";

/**
 * Guard client-side: redirect ke /login jika belum ada session/profil.
 * Dipakai di layout area terproteksi (dashboard, opportunities, dll).
 */
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const meFromStore = useSessionStore((s) => s.me);
  const { data: meFromQuery, isLoading, isError } = useMe(true);
  const me = meFromStore ?? meFromQuery ?? null;

  useEffect(() => {
    if (!isLoading && (!me || isError)) {
      router.replace("/login");
    }
  }, [isLoading, me, isError, router]);

  if (isLoading && !me) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
      </div>
    );
  }

  if (!me) {
    return null;
  }

  return <>{children}</>;
}
