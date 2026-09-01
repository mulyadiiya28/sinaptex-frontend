"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, MapPin, Building2, ChevronLeft, ChevronRight } from "lucide-react";
import { useMarketplace } from "@/features/opportunity/opportunity.hooks";
import {
  MarketplaceListParams,
  OpportunityType,
} from "@/features/opportunity/opportunity.schema";

const TYPE_TABS: { label: string; type?: OpportunityType }[] = [
  { label: "Semua" },
  { label: "Need", type: "NEED" },
  { label: "Offer", type: "OFFER" },
];

const SORT_OPTIONS: {
  label: string;
  sortBy: MarketplaceListParams["sortBy"];
  sortOrder: MarketplaceListParams["sortOrder"];
}[] = [
  { label: "Terbaru", sortBy: "createdAt", sortOrder: "desc" },
  { label: "Budget terendah", sortBy: "budgetMin", sortOrder: "asc" },
  { label: "Budget tertinggi", sortBy: "budgetMax", sortOrder: "desc" },
  { label: "Prioritas", sortBy: "priority", sortOrder: "desc" },
];

export default function MarketplacePage() {
  const [typeIdx, setTypeIdx] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [sortIdx, setSortIdx] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 12;

  const params: MarketplaceListParams = useMemo(
    () => ({
      type: TYPE_TABS[typeIdx].type,
      search: search || undefined,
      location: location || undefined,
      sortBy: SORT_OPTIONS[sortIdx].sortBy,
      sortOrder: SORT_OPTIONS[sortIdx].sortOrder,
      page,
      limit,
    }),
    [typeIdx, search, location, sortIdx, page]
  );

  const { data, isLoading, isFetching, error } = useMarketplace(params);
  const items = data?.data ?? [];
  const meta = data?.meta;

  function applySearch(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  }

  function changeType(idx: number) {
    setTypeIdx(idx);
    setPage(1);
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Marketplace
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Jelajahi Need & Offer publik dari pelaku bisnis lain.
          </p>
        </div>
        <Link
          href="/opportunities/new"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Posting Opportunity
        </Link>
      </div>

      {/* Search + location */}
      <form
        onSubmit={applySearch}
        className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900 sm:flex-row"
      >
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Cari judul atau deskripsi…"
            className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none ring-zinc-900 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:ring-zinc-100"
          />
        </div>
        <div className="relative sm:w-48">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            value={location}
            onChange={(e) => {
              setLocation(e.target.value);
              setPage(1);
            }}
            placeholder="Lokasi"
            className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 pr-3 text-sm outline-none ring-zinc-900 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:ring-zinc-100"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Cari
        </button>
      </form>

      {/* Type tabs + sort */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border border-zinc-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900">
          {TYPE_TABS.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => changeType(i)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
                typeIdx === i
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                  : "text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          value={sortIdx}
          onChange={(e) => {
            setSortIdx(Number(e.target.value));
            setPage(1);
          }}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
        >
          {SORT_OPTIONS.map((opt, i) => (
            <option key={opt.label} value={i}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Results meta */}
      {meta && (
        <p className="text-xs text-zinc-400">
          {meta.total} hasil · halaman {meta.page} dari {meta.totalPages}
          {isFetching && !isLoading ? " · memperbarui…" : ""}
        </p>
      )}

      {isLoading && (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
          {error instanceof Error ? error.message : "Gagal memuat marketplace"}
        </div>
      )}

      {!isLoading && !error && items.length === 0 && (
        <div className="rounded-xl border border-dashed border-zinc-300 py-16 text-center dark:border-zinc-700">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Tidak ada opportunity yang cocok dengan filter Anda.
          </p>
        </div>
      )}

      {!isLoading && items.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((opp) => (
            <li key={opp.id}>
              <Link
                href={`/marketplace/${opp.id}`}
                className="flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700"
              >
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
                  {opp.priority && opp.priority !== "MEDIUM" && (
                    <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
                      {opp.priority}
                    </span>
                  )}
                </div>

                <h2 className="mt-2 line-clamp-2 font-medium text-zinc-900 dark:text-zinc-50">
                  {opp.title}
                </h2>
                <p className="mt-1 line-clamp-3 flex-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {opp.description}
                </p>

                <div className="mt-4 space-y-1.5 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                  {opp.party && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <Building2 className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{opp.party.name}</span>
                      {opp.party.verificationStatus === "APPROVED" && (
                        <span className="rounded bg-emerald-100 px-1 text-[10px] text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                          verified
                        </span>
                      )}
                    </div>
                  )}
                  {opp.location && (
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{opp.location}</span>
                    </div>
                  )}
                  {(opp.budgetMin != null || opp.budgetMax != null) && (
                    <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      {formatBudget(opp.budgetMin, opp.budgetMax)}
                    </p>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-zinc-700"
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </button>
          <span className="px-2 text-sm text-zinc-500">
            {page} / {meta.totalPages}
          </span>
          <button
            type="button"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm disabled:opacity-40 dark:border-zinc-700"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}

function formatBudget(min?: number | null, max?: number | null) {
  const fmt = (n: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(n);
  if (min != null && max != null) return `${fmt(min)} – ${fmt(max)}`;
  if (min != null) return `dari ${fmt(min)}`;
  if (max != null) return `hingga ${fmt(max)}`;
  return "";
}
