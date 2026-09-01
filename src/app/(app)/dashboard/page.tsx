"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  MessageSquare,
  Handshake,
  Crown,
  Store,
  Mail,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useSessionStore } from "@/store/use-session-store";
import { useOpportunities } from "@/features/opportunity/opportunity.hooks";
import { useInvitations, useRespondInvitation } from "@/features/invitation/invitation.hooks";

const cards = [
  {
    href: "/marketplace",
    label: "Marketplace",
    desc: "Jelajahi Need & Offer publik",
    icon: Store,
  },
  {
    href: "/opportunities",
    label: "Opportunity saya",
    desc: "Kelola Need & Offer aktif",
    icon: Briefcase,
  },
  {
    href: "/chat",
    label: "Chat",
    desc: "Percakapan dengan partner",
    icon: MessageSquare,
  },
  {
    href: "/deals",
    label: "Deal",
    desc: "Negosiasi hingga selesai",
    icon: Handshake,
  },
  {
    href: "/membership",
    label: "Membership",
    desc: "Upgrade kuota & fitur",
    icon: Crown,
  },
];

export default function DashboardPage() {
  const me = useSessionStore((s) => s.me);
  const { data, isLoading } = useOpportunities({ limit: 50 });
  const { data: invitations, isLoading: isInvLoading } = useInvitations();
  const respondInvitation = useRespondInvitation();

  const [invActionError, setInvActionError] = useState<string | null>(null);
  const [invActionSuccess, setInvActionSuccess] = useState<string | null>(null);

  const myOpps = data?.data ?? [];
  const activeCount = myOpps.filter((o) => o.status === "ACTIVE").length;
  const needCount = myOpps.filter((o) => o.type === "NEED" && o.status === "ACTIVE").length;
  const offerCount = myOpps.filter((o) => o.type === "OFFER" && o.status === "ACTIVE").length;

  const pendingInvitations = (invitations ?? []).filter((inv) => inv.status === "PENDING");

  async function handleRespond(id: string, action: "ACCEPTED" | "REJECTED") {
    setInvActionError(null);
    setInvActionSuccess(null);
    try {
      await respondInvitation.mutateAsync({ id, action });
      setInvActionSuccess(
        action === "ACCEPTED"
          ? "Undangan diterima! Deal negosiasi baru telah dibuat di halaman Deal."
          : "Undangan telah ditolak."
      );
    } catch (err) {
      setInvActionError(err instanceof Error ? err.message : "Gagal memproses undangan");
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Selamat datang{me ? `, ${me.fullName}` : ""}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Ringkasan aktivitas business matching dan transaksi kemitraan Anda.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/opportunities/new"
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            + Buat Opportunity
          </Link>
        </div>
      </div>

      {invActionSuccess && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
          <CheckCircle2 className="h-5 w-5 shrink-0" />
          <span>{invActionSuccess}</span>
        </div>
      )}

      {invActionError && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 p-4 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{invActionError}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Opportunity aktif" value={isLoading ? "…" : String(activeCount)} />
        <StatCard label="Need aktif" value={isLoading ? "…" : String(needCount)} />
        <StatCard label="Offer aktif" value={isLoading ? "…" : String(offerCount)} />
      </div>

      {/* Pending Invitations Section */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  Undangan Matching Masuk
                </h2>
                {pendingInvitations.length > 0 && (
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-bold text-white">
                    {pendingInvitations.length} Baru
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Calon mitra yang mengundang Anda untuk berkolaborasi dan membuka jalur Deal.
              </p>
            </div>
          </div>

          <Link
            href="/deals"
            className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            Lihat semua deal <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-4">
          {isInvLoading ? (
            <div className="flex justify-center py-6">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
            </div>
          ) : pendingInvitations.length === 0 ? (
            <div className="py-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
              Tidak ada undangan matching tertunda. Jalankan matching pada opportunity Anda untuk mengundang calon mitra.
            </div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {pendingInvitations.map((inv) => (
                <div
                  key={inv.id}
                  className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        Undangan #{inv.id.slice(0, 8)}
                      </span>
                      <span className="flex items-center gap-1 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        <Clock className="h-3 w-3" />
                        Menunggu Respons
                      </span>
                    </div>
                    {inv.message && (
                      <p className="text-xs text-zinc-600 italic dark:text-zinc-300">
                        &ldquo;{inv.message}&rdquo;
                      </p>
                    )}
                    <p className="text-[11px] text-zinc-400">
                      Opportunity Target: {inv.targetOpportunityId.slice(0, 12)}… · Dibuat:{" "}
                      {new Date(inv.createdAt).toLocaleDateString("id-ID")}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleRespond(inv.id, "ACCEPTED")}
                      disabled={respondInvitation.isPending}
                      className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Terima (Buat Deal)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRespond(inv.id, "REJECTED")}
                      disabled={respondInvitation.isPending}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-50 dark:border-red-900/40 dark:text-red-400"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      Tolak
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Nav Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <Icon className="h-5 w-5 text-zinc-700 dark:text-zinc-300" />
              </div>
              <div>
                <h2 className="font-medium text-zinc-900 dark:text-zinc-50">{card.label}</h2>
                <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{card.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-zinc-900 dark:text-zinc-50">{value}</p>
    </div>
  );
}

