"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignUp } from "@/features/auth/auth.hooks";
import { useSessionStore } from "@/store/use-session-store";

export default function RegisterPage() {
  const router = useRouter();
  const signUp = useSignUp();
  const me = useSessionStore((s) => s.me);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [needsConfirm, setNeedsConfirm] = useState(false);

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
    setNeedsConfirm(false);

    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }

    try {
      const result = await signUp.mutateAsync({
        email,
        password,
        fullName,
        phone: phone || undefined,
      });

      if (result.profile) {
        router.replace("/dashboard");
      } else {
        setNeedsConfirm(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mendaftar");
    }
  }

  if (needsConfirm) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
        <div className="w-full max-w-md space-y-6 rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Cek email Anda
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Kami telah mengirim link konfirmasi ke <strong>{email}</strong>.
            Silakan verifikasi akun sebelum masuk.
          </p>
          <Link
            href="/login"
            className="inline-block text-sm font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
          >
            Kembali ke halaman masuk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Daftar Sinaptex
          </h1>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Buat akun untuk mulai matching bisnis
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="fullName"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Nama lengkap
            </label>
            <input
              id="fullName"
              type="text"
              required
              minLength={2}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none ring-zinc-900 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-100"
              placeholder="Nama Anda"
            />
          </div>

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
              htmlFor="phone"
              className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Nomor telepon{" "}
              <span className="font-normal text-zinc-400">(opsional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none ring-zinc-900 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-100"
              placeholder="08xxxxxxxxxx"
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
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-zinc-300 bg-white px-3.5 py-2.5 text-sm text-zinc-900 outline-none ring-zinc-900 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-100"
              placeholder="Minimal 6 karakter"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={signUp.isPending}
            className="flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:opacity-60 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {signUp.isPending ? "Memproses…" : "Daftar"}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
          Sudah punya akun?{" "}
          <Link
            href="/login"
            className="font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
          >
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
