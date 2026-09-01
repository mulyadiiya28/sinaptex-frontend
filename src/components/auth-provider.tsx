"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase-client";
import { useSessionStore } from "@/store/use-session-store";
import { authKeys } from "@/features/auth/auth.hooks";
import { authApi } from "@/features/auth/auth.api";
import { useNotificationSocket } from "@/features/notification/use-notification-socket";
import { disconnectSocket } from "@/lib/socket-client";

/**
 * Menyimak perubahan session Supabase dan sinkronkan ke:
 * - Zustand (useSessionStore)
 * - React Query cache (authKeys.me)
 * - Socket.IO (notifikasi + chat real-time)
 *
 * Dipasang sekali di root layout.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const setMe = useSessionStore((s) => s.setMe);
  const [ready, setReady] = useState(false);

  // Real-time notifications (connect saat me tersedia)
  useNotificationSocket();

  useEffect(() => {
    let mounted = true;

    // Safety timeout: pastikan ready=true dalam maksimal 1.5 detik jika Supabase lambat/offline
    const safetyTimer = setTimeout(() => {
      if (mounted) {
        setReady(true);
      }
    }, 1500);

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        const session = data?.session ?? null;
        handleSession(session);
      })
      .catch((err) => {
        console.warn("[AuthProvider] Supabase session check error:", err);
      })
      .finally(() => {
        if (mounted) {
          setReady(true);
          clearTimeout(safetyTimer);
        }
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
        disconnectSocket();
        return;
      }

      try {
        const me = await authApi.me();
        if (!mounted) return;
        setMe(me);
        queryClient.setQueryData(authKeys.me, me);
      } catch (err) {
        if (!mounted) return;
        console.warn("[AuthProvider] Failed fetching me profile:", err);
        setMe(null);
        queryClient.removeQueries({ queryKey: authKeys.me });
        disconnectSocket();
      }
    }

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      subscription.unsubscribe();
    };
  }, [queryClient, setMe]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
      </div>
    );
  }

  return <>{children}</>;
}
