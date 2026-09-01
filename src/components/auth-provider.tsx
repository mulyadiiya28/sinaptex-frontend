"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase-client";
import { useSessionStore } from "@/store/use-session-store";
import { authKeys } from "@/features/auth/auth.hooks";
import { authApi } from "@/features/auth/auth.api";

/**
 * Menyimak perubahan session Supabase dan sinkronkan ke:
 * - Zustand (useSessionStore)
 * - React Query cache (authKeys.me)
 *
 * Dipasang sekali di root layout.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const setMe = useSessionStore((s) => s.setMe);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      handleSession(session);
      setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      await handleSession(session);
    });

    async function handleSession(session: Session | null) {
      if (!session) {
        setMe(null);
        queryClient.removeQueries({ queryKey: authKeys.me });
        return;
      }

      // Ada session → ambil profil dari engine
      try {
        const me = await authApi.me();
        setMe(me);
        queryClient.setQueryData(authKeys.me, me);
      } catch {
        // Token valid di Supabase tapi belum terdaftar di engine
        // (misalnya baru signUp tapi register profile gagal / belum dipanggil)
        setMe(null);
        queryClient.removeQueries({ queryKey: authKeys.me });
      }
    }

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [queryClient, setMe]);

  // Hindari flash konten sebelum session dicek
  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
      </div>
    );
  }

  return <>{children}</>;
}
