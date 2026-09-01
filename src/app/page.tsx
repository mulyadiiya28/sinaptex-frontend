"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Handshake,
  ShieldCheck,
  Zap,
  Globe2,
} from "lucide-react";
import { useSessionStore } from "@/store/use-session-store";
import { SinaptexLogo } from "@/components/sinaptex-logo";

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
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-black">
      {/* Subtle Background Glow Elements */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[700px] rounded-full bg-gradient-to-tr from-sky-400/10 via-blue-500/10 to-indigo-500/10 blur-3xl dark:from-sky-500/15 dark:to-purple-600/15" />

      {/* Top Navbar */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <SinaptexLogo
          variant="horizontal"
          size="sm"
          showTagline={false}
        />
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-700 transition hover:text-zinc-900 dark:text-zinc-300 dark:hover:text-white"
          >
            Masuk
          </Link>
          <Link
            href="/register"
            className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Daftar Gratis
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-4xl px-6 pt-12 pb-24 text-center sm:pt-20">
        {/* Brand Badge */}
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-zinc-200/80 bg-white/80 px-4 py-1.5 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-300">
          <Sparkles className="h-3.5 w-3.5 text-blue-500" />
          <span>Platform Pencocokan Kemitraan & AI Matching</span>
        </div>

        {/* Central Brand Showcase */}
        <div className="mb-6 flex justify-center">
          <SinaptexLogo
            variant="vertical"
            size="xl"
            taglineText="Ekosistem Bisnis dan Layanan Cerdas"
          />
        </div>

        <p className="mx-auto mt-4 max-w-2xl text-base text-zinc-600 sm:text-lg dark:text-zinc-300">
          Menghubungkan kebutuhan (<span className="font-semibold text-blue-600 dark:text-blue-400">Need</span>) dan penawaran (<span className="font-semibold text-violet-600 dark:text-violet-400">Offer</span>) bisnis Anda dengan algoritma cerdas, verifikasi reputasi, dan jalur transaksi terintegrasi.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/register"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:shadow-indigo-500/35 hover:brightness-110 sm:w-auto"
          >
            Mulai Sekarang
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-7 py-3.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 sm:w-auto"
          >
            <Globe2 className="h-4 w-4 text-zinc-500" />
            Jelajahi Marketplace
          </Link>
        </div>

        {/* 3 Core Pillars */}
        <div className="mt-20 grid gap-6 text-left sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200/80 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-50">
              Algoritma Cerdas
            </h3>
            <p className="mt-2 text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
              Pencocokan multi-faktor berdasarkan kapabilitas bisnis, lokasi, kategori, dan skor kredibilitas.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-50">
              Mitra Terverifikasi
            </h3>
            <p className="mt-2 text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
              Verifikasi KYC dan dokumen legalitas untuk membangun transaksi kemitraan yang aman dan kredibel.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200/80 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-zinc-800/80 dark:bg-zinc-900/60">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Handshake className="h-5 w-5" />
            </div>
            <h3 className="mt-4 font-semibold text-zinc-900 dark:text-zinc-50">
              Siklus Deal & Chat
            </h3>
            <p className="mt-2 text-xs text-zinc-600 leading-relaxed dark:text-zinc-400">
              Dari undangan kolaborasi, negosiasi deal, chat real-time, hingga ulasan penilaian performa kemitraan.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
