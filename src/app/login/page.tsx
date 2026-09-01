"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn } from "@/features/auth/auth.hooks";
import { useSessionStore } from "@/store/use-session-store";

export default function LoginPage() {
  const router = useRouter();
  const signIn = useSignIn();
  const me = useSessionStore((s) => s.me);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (me) router.replace("/dashboard");
  }, [me, router]);

  if (me) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    try {
      await signIn.mutateAsync({ email, password });
      router.replace("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Masuk ke Sinaptex
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Platform business matching
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none ring-zinc-900 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-100"
              placeholder="nama@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none ring-zinc-900 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-100"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={signIn.isPending}
            className="flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {signIn.isPending ? "Memproses…" : "Masuk"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
          >
            Daftar
          </Link>
        </p>
      </div>
    </div>
  );
}
