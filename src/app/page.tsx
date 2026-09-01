"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/store/use-session-store";

export default function Home() {
  const router = useRouter();
  const me = useSessionStore((s) => s.me);

  useEffect(() => {
    if (me) {
      router.replace("/dashboard");
    }
  }, [me, router]);

  if (me) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
      </div>
    );
  }

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
