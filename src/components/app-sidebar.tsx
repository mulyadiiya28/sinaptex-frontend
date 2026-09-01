"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Store,
  Briefcase,
  MessageSquare,
  Handshake,
  User,
  Crown,
  Bell,
  X,
  Download,
  CheckCircle2,
} from "lucide-react";
import { useUIStore } from "@/store/use-ui-store";
import { usePWA } from "@/components/pwa-provider";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/marketplace", label: "Marketplace", icon: Store },
  { href: "/opportunities", label: "Opportunity saya", icon: Briefcase },
  { href: "/chat", label: "Chat", icon: MessageSquare },
  { href: "/deals", label: "Deal", icon: Handshake },
  { href: "/membership", label: "Membership", icon: Crown },
  { href: "/profile", label: "Profil", icon: User },
  { href: "/notifications", label: "Notifikasi", icon: Bell },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { isSidebarOpen, setSidebarOpen } = useUIStore();
  const { isInstalled, isInstallable, promptInstall } = usePWA();

  if (!isSidebarOpen) return null;

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/40 md:hidden"
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Container */}
      <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-zinc-200 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900 md:static md:w-56 md:shadow-none">
        <div className="flex h-14 items-center justify-between border-b border-zinc-200 px-4 dark:border-zinc-800">
          <Link
            href="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
          >
            Sinaptex
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 md:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-3">
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 768) {
                    setSidebarOpen(false);
                  }
                }}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* PWA status / install banner */}
        <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
          {isInstalled ? (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
              <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
              <span>Sinaptex PWA Aktif</span>
            </div>
          ) : isInstallable ? (
            <button
              type="button"
              onClick={promptInstall}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-900 px-3 py-2 text-xs font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Download className="h-3.5 w-3.5" />
              Install Aplikasi PWA
            </button>
          ) : (
            <div className="text-[11px] text-zinc-400 dark:text-zinc-500">
              Sinaptex v1.0 • Serwist PWA
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
