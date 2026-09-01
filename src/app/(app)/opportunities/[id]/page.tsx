"use client";

import { use } from "react";
import Link from "next/link";
import { useOpportunity } from "@/features/opportunity/opportunity.hooks";

const statusColor: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  CLOSED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  EXPIRED: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

export default function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: opp, isLoading, error } = useOpportunity(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
      </div>
    );
  }

  if (error || !opp) {
    return (
      <div className="mx-auto max-w-2xl space-y-4">
        <Link
          href="/opportunities"
          className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
        >
          ← Kembali
        </Link>
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
          {error instanceof Error ? error.message : "Opportunity tidak ditemukan"}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        href="/opportunities"
        className="text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
      >
        ← Kembali ke daftar
      </Link>

      <div className="rounded-xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded px-1.5 py-0.5 text-xs font-medium ${
              opp.type === "NEED"
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                : "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400"
            }`}
          >
            {opp.type}
          </span>
          <span
            className={`rounded px-1.5 py-0.5 text-xs font-medium ${
              statusColor[opp.status] ?? statusColor.CLOSED
            }`}
          >
            {opp.status}
          </span>
        </div>

        <h1 className="mt-3 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          {opp.title}
        </h1>

        <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          {opp.description}
        </p>

        <dl className="mt-6 grid gap-4 border-t border-zinc-100 pt-6 sm:grid-cols-2 dark:border-zinc-800">
          {opp.location && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Lokasi
              </dt>
              <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-50">{opp.location}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
              Dibuat
            </dt>
            <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-50">
              {new Date(opp.createdAt).toLocaleString("id-ID")}
            </dd>
          </div>
          {(opp.budgetMin != null || opp.budgetMax != null) && (
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Budget
              </dt>
              <dd className="mt-0.5 text-sm text-zinc-900 dark:text-zinc-50">
                {opp.budgetMin != null ? `Rp ${opp.budgetMin.toLocaleString("id-ID")}` : "—"}
                {" – "}
                {opp.budgetMax != null ? `Rp ${opp.budgetMax.toLocaleString("id-ID")}` : "—"}
              </dd>
            </div>
          )}
          {opp.tags && opp.tags.length > 0 && (
            <div className="sm:col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">
                Tags
              </dt>
              <dd className="mt-1 flex flex-wrap gap-1.5">
                {opp.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </dd>
            </div>
          )}
        </dl>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-zinc-100 pt-6 dark:border-zinc-800">
          <Link
            href={`/matching/${opp.id}`}
            className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Jalankan matching
          </Link>
        </div>
      </div>
    </div>
  );
}
