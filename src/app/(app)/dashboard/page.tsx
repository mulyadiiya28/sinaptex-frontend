"use client";

import Link from "next/link";
import { Briefcase, MessageSquare, Handshake, Crown } from "lucide-react";
import { useSessionStore } from "@/store/use-session-store";
import { useOpportunities } from "@/features/opportunity/opportunity.hooks";

const cards = [
  {
    href: "/opportunities",
    label: "Opportunity",
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
  const { data: myOpps, isLoading } = useOpportunities({ mine: true });

  const activeCount =
    myOpps?.filter((o) => o.status === "ACTIVE").length ?? 0;
  const needCount =
    myOpps?.filter((o) => o.type === "NEED" && o.status === "ACTIVE").length ?? 0;
  const offerCount =
    myOpps?.filter((o) => o.type === "OFFER" && o.status === "ACTIVE").length ?? 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Selamat datang{me ? `, ${me.fullName}` : ""}
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Ringkasan aktivitas business matching Anda.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Opportunity aktif" value={isLoading ? "…" : String(activeCount)} />
        <StatCard label="Need aktif" value={isLoading ? "…" : String(needCount)} />
        <StatCard label="Offer aktif" value={isLoading ? "…" : String(offerCount)} />
      </div>

      {/* Quick links */}
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
