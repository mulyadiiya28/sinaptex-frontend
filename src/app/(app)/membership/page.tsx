"use client";

import { useState } from "react";
import {
  Crown,
  Check,
  Sparkles,
  Rocket,
  AlertCircle,
} from "lucide-react";
import {
  useMembershipStatus,
  useMembershipCheckout,
} from "@/features/membership/membership.hooks";

const membershipBenefits = [
  "Maksimal 20 Need & 20 Offer aktif bersamaan (kuota reguler: 1 Need + 1 Offer)",
  "Prioritas tinggi pada algoritma Business Matching Engine",
  "Akses fitur chat langsung tanpa batas origin type",
  "Badge Verified Member eksklusif di Marketplace",
  "Notifikasi instan prioritas saat ada partner baru yang cocok",
];

export default function MembershipPage() {
  const { data: status, isLoading: isStatusLoading } = useMembershipStatus();
  const checkout = useMembershipCheckout();

  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const isMemberActive = status?.isActive ?? false;

  async function handleCheckout(planId: string) {
    setCheckoutError(null);
    try {
      const result = await checkout.mutateAsync(planId);
      if (result?.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (err) {
      setCheckoutError(
        err instanceof Error ? err.message : "Gagal memproses checkout membership"
      );
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Membership & Boost
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Tingkatkan kuota opportunity dan maksimalkan eksposur bisnis Anda di Sinaptex.
        </p>
      </div>

      {checkoutError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{checkoutError}</span>
        </div>
      )}

      {/* Current Status Card */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400">
              <Crown className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  Status Langganan Anda
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    isMemberActive
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {isStatusLoading ? "Memeriksa…" : isMemberActive ? "Member Aktif" : "Akun Standar (Gratis)"}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {isMemberActive && status?.expiresAt
                  ? `Berlaku hingga ${new Date(status.expiresAt).toLocaleDateString("id-ID")}`
                  : "Batas kuota gratis: 1 Need aktif dan 1 Offer aktif."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-800/40">
              <span className="text-zinc-500 dark:text-zinc-400">Kuota Need</span>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                {isMemberActive ? "20 Aktif" : "1 Aktif"}
              </p>
            </div>
            <div className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 text-center dark:border-zinc-800 dark:bg-zinc-800/40">
              <span className="text-zinc-500 dark:text-zinc-400">Kuota Offer</span>
              <p className="text-base font-bold text-zinc-900 dark:text-zinc-50">
                {isMemberActive ? "20 Aktif" : "1 Aktif"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Membership Plans */}
      <div className="space-y-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Pilihan Paket Membership
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Dapatkan fleksibilitas penuh untuk ekspansi kemitraan bisnis tanpa batasan.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Plan: Monthly */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Bulanan
              </span>
              <h3 className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                Pro Membership
              </h3>
              <p className="mt-3 text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                Rp 299.000
                <span className="text-sm font-normal text-zinc-500"> / bulan</span>
              </p>
              <ul className="mt-6 space-y-3">
                {membershipBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                    <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => handleCheckout("plan_monthly")}
              disabled={checkout.isPending || isMemberActive}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              {isMemberActive ? "Sudah Aktif" : checkout.isPending ? "Memproses…" : "Pilih Paket Bulanan"}
            </button>
          </div>

          {/* Plan: Yearly */}
          <div className="relative flex flex-col justify-between rounded-2xl border-2 border-zinc-900 bg-white p-6 shadow-md dark:border-zinc-100 dark:bg-zinc-900">
            <div className="absolute -top-3 right-4 rounded-full bg-amber-500 px-3 py-0.5 text-[11px] font-bold text-white uppercase tracking-wider">
              Hemat 20%
            </div>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Tahunan (Terpopuler)
              </span>
              <h3 className="mt-1 text-xl font-bold text-zinc-900 dark:text-zinc-50">
                Pro Annual
              </h3>
              <p className="mt-3 text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">
                Rp 2.890.000
                <span className="text-sm font-normal text-zinc-500"> / tahun</span>
              </p>
              <ul className="mt-6 space-y-3">
                {membershipBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-xs text-zinc-600 dark:text-zinc-300">
                    <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={() => handleCheckout("plan_yearly")}
              disabled={checkout.isPending || isMemberActive}
              className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-semibold text-white transition hover:bg-amber-600 disabled:opacity-50"
            >
              {isMemberActive ? "Sudah Aktif" : checkout.isPending ? "Memproses…" : "Pilih Paket Tahunan"}
            </button>
          </div>
        </div>
      </div>

      {/* Boost Section */}
      <div className="space-y-4 pt-4">
        <div>
          <div className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-indigo-500" />
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              Boost Opportunity
            </h2>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Tingkatkan posisi postingan Anda di hasil pencarian teratas dan perbesar peluang matching.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              BASIC
            </span>
            <h4 className="mt-2 font-semibold text-zinc-900 dark:text-zinc-50">Boost 3 Hari</h4>
            <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">Rp 49.000</p>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              +15% bobot skor ranking matching selama 3 hari.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
              PREMIUM
            </span>
            <h4 className="mt-2 font-semibold text-zinc-900 dark:text-zinc-50">Boost 7 Hari</h4>
            <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">Rp 99.000</p>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              +30% bobot skor ranking matching & badge sorotan selama 7 hari.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-semibold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
              VIP
            </span>
            <h4 className="mt-2 font-semibold text-zinc-900 dark:text-zinc-50">Boost 14 Hari</h4>
            <p className="mt-1 text-lg font-bold text-zinc-900 dark:text-zinc-50">Rp 179.000</p>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Prioritas ranking tertinggi & rekomendasi otomatis ke calon mitra matching.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
