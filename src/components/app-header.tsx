"use client";

import { useRouter } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen, LogOut } from "lucide-react";
import { useUIStore } from "@/store/use-ui-store";
import { useSessionStore } from "@/store/use-session-store";
import { useSignOut } from "@/features/auth/auth.hooks";

export function AppHeader() {
  const router = useRouter();
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const me = useSessionStore((s) => s.me);
  const signOut = useSignOut();

  async function handleLogout() {
    await signOut.mutateAsync();
    router.replace("/login");
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSidebar}
          className="inline-flex items-center justify-center rounded-md border border-zinc-200 p-1.5 text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          aria-label="Toggle sidebar"
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </button>
        <span className="text-sm font-medium text-zinc-500 md:hidden dark:text-zinc-400">
          Sinaptex
        </span>
      </div>

      <div className="flex items-center gap-3">
        {me && (
          <span className="hidden text-sm text-zinc-600 sm:inline dark:text-zinc-400">
            {me.fullName}
            {me.isVerified && (
              <span className="ml-1.5 rounded bg-emerald-100 px-1.5 py-0.5 text-xs text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400">
                verified
              </span>
            )}
          </span>
        )}
        <button
          type="button"
          onClick={handleLogout}
          disabled={signOut.isPending}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 transition hover:bg-zinc-100 disabled:opacity-60 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          <LogOut className="h-3.5 w-3.5" />
          {signOut.isPending ? "Keluar…" : "Keluar"}
        </button>
      </div>
    </header>
  );
}
