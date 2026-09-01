import { create } from "zustand";
import { Me } from "@/features/auth/auth.schema";

/**
 * Cache ringan profil user yang sedang login di client (bukan sumber kebenaran —
 * source of truth tetap Supabase session + `useMe()` dari React Query).
 */
interface SessionState {
  me: Me | null;
  setMe: (me: Me | null) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  me: null,
  setMe: (me) => set({ me }),
}));
