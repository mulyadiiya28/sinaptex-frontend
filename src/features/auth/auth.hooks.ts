"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase-client";
import { useSessionStore } from "@/store/use-session-store";
import { authApi } from "./auth.api";
import { RegisterProfileInput } from "./auth.schema";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export function useMe(enabled = true) {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authApi.me,
    enabled,
  });
}

export function useRegisterProfile() {
  const queryClient = useQueryClient();
  const setMe = useSessionStore((s) => s.setMe);

  return useMutation({
    mutationFn: (input: RegisterProfileInput) => authApi.register(input),
    onSuccess: (data) => {
      setMe(data);
      queryClient.setQueryData(authKeys.me, data);
    },
  });
}

export type SignInInput = {
  email: string;
  password: string;
};

export function useSignIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ email, password }: SignInInput) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Session berubah → AuthProvider + onAuthStateChange akan trigger refetch me
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}

export type SignUpInput = {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
};

export function useSignUp() {
  const queryClient = useQueryClient();
  const setMe = useSessionStore((s) => s.setMe);

  return useMutation({
    mutationFn: async ({ email, password, fullName, phone }: SignUpInput) => {
      // 1. Daftar di Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });
      if (error) throw error;

      // 2. Jika session langsung tersedia (email confirm dimatikan),
      //    sinkronkan profil ke engine.
      if (data.session) {
        const profile = await authApi.register({
          fullName,
          email,
          phone,
        });
        return { supabase: data, profile };
      }

      // Kalau butuh konfirmasi email, session null — user harus verify dulu.
      return { supabase: data, profile: null };
    },
    onSuccess: (result) => {
      if (result.profile) {
        setMe(result.profile);
        queryClient.setQueryData(authKeys.me, result.profile);
      }
      queryClient.invalidateQueries({ queryKey: authKeys.me });
    },
  });
}

export function useSignOut() {
  const queryClient = useQueryClient();
  const setMe = useSessionStore((s) => s.setMe);

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      setMe(null);
      queryClient.removeQueries({ queryKey: authKeys.me });
      queryClient.clear();
    },
  });
}
