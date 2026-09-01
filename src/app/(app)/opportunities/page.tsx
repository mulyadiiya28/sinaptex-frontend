"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useOpportunities } from "@/features/opportunity/opportunity.hooks";
import { OpportunityType } from "@/features/opportunity/opportunity.schema";

const filters: { label: string; type?: OpportunityType }[] = [
  { label: "Semua" },
  { label: "Need", type: "NEED" },
  { label: "Offer", type: "OFFER" },
];

const statusColor: Record<string, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
  CLOSED: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  EXPIRED: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  MATCHED: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

export default function OpportunitiesPage() {
  const [filterIdx, setFilterIdx] = useState(0);
  const filter = filters[filterIdx];
  // Engine list publik; untuk "milik saya" idealnya ada endpoint terpisah.
  // Sementara tampilkan list dengan filter type (user bisa filter posting sendiri di detail).
  const { data, isLoading, error } = useOpportunities({
    type: filter.type,
    limit: 50,
  });

  const items = data?.data ?? [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Opportunity saya
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Kelola Need & Offer yang Anda posting. Jelajahi publik di{" "}
            <Link href="/marketplace" className="underline-offset-2 hover:underline">
              Marketplace
            </Link>
            .
          </p>
        </div>
        <Link
          href="/opportunities/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          <Plus className="h-4 w-4" />
          Buat baru
        </Link>
      </div>

      <div className="flex gap-1 rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
        {filters.map((f, i) => (
          <button
            key={f.label}
            type="button"
            onClick={() => setFilterIdx(i)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
              filterIdx === i
                ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
          {error instanceof Error ? error.message : "Gagal memuat data"}
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Belum ada opportunity. Buat Need atau Offer pertama Anda.
          </p>
          <Link
            href="/opportunities/new"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50"
          >
            <Plus className="h-4 w-4" />
            Buat opportunity
          </Link>
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <ul className="space-y-3">
          {items.map((opp) => (
            <li key={opp.id}>
              <Link
                href={`/opportunities/${opp.id}`}
                className="block rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
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
                    <h2 className="mt-2 font-medium text-zinc-900 dark:text-zinc-50">
                      {opp.title}
                    </h2>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-500 dark:text-zinc-400">
                      {opp.description}
                    </p>
                  </div>
                  <time className="shrink-0 text-xs text-zinc-400">
                    {new Date(opp.createdAt).toLocaleDateString("id-ID")}
                  </time>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
