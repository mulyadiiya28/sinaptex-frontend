"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMe, useSignOut } from "@/features/auth/auth.hooks";
import { useSessionStore } from "@/store/use-session-store";

export default function Home() {
  const router = useRouter();
  const meFromStore = useSessionStore((s) => s.me);
  const { data: meFromQuery, isLoading } = useMe(!!meFromStore || true);
  const signOut = useSignOut();

  const me = meFromStore ?? meFromQuery ?? null;

  async function handleLogout() {
    await signOut.mutateAsync();
    router.replace("/login");
  }

  if (isLoading && !me) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
      </div>
    );
  }

  // Belum login
  if (!me) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        <div className="max-w-md space-y-6 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Sinaptex
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Platform business matching untuk menemukan partner, opportunity, dan
            deal yang tepat.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/login"
              className="rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Masuk
            </Link>
            <Link
              href="/register"
              className="rounded-lg border border-zinc-300 px-6 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-800"
            >
              Daftar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Sudah login
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Sinaptex
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {me.fullName}
              {me.isVerified && (
                <span className="ml-1.5 rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                  verified
                </span>
              )}
            </span>
            <button
              onClick={handleLogout}
              disabled={signOut.isPending}
              className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {signOut.isPending ? "Keluar…" : "Keluar"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Selamat datang, {me.fullName}
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Email: {me.email}
        </p>
        <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
          Auth sudah terintegrasi. Silakan lanjutkan build fitur (opportunity,
          matching, chat, dll).
        </p>
      </main>
    </div>
  );
}
