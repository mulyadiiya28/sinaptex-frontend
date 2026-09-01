"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import {
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationCount,
} from "@/features/notification/notification.hooks";
import { notificationText } from "@/features/notification/notification.schema";
import { useSessionStore } from "@/store/use-session-store";

export function NotificationBell() {
  const me = useSessionStore((s) => s.me);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const enabled = Boolean(me);
  const { data, isLoading } = useNotifications(enabled);
  const unread = useUnreadNotificationCount(enabled);
  const markRead = useMarkNotificationRead();

  const items = (data ?? []).slice(0, 8);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  if (!me) return null;

  async function handleClickItem(id: string, isRead: boolean) {
    if (!isRead) {
      try {
        await markRead.mutateAsync(id);
      } catch {
        // ignore
      }
    }
    setOpen(false);
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative inline-flex items-center justify-center rounded-md border border-zinc-200 p-1.5 text-zinc-600 transition hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
        aria-label="Notifikasi"
      >
        <Bell className="h-4 w-4" />
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-medium text-white">
            {unread > 99 ? "99+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-900 sm:w-96">
          <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
            <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              Notifikasi
            </span>
            {unread > 0 && (
              <span className="text-xs text-zinc-500">{unread} belum dibaca</span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {isLoading && (
              <div className="flex justify-center py-8">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900" />
              </div>
            )}

            {!isLoading && items.length === 0 && (
              <p className="px-4 py-8 text-center text-sm text-zinc-500">
                Belum ada notifikasi
              </p>
            )}

            {items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => handleClickItem(n.id, n.isRead)}
                className={`flex w-full flex-col gap-0.5 border-b border-zinc-50 px-4 py-3 text-left transition hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800/50 ${
                  !n.isRead ? "bg-zinc-50/80 dark:bg-zinc-800/30" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-50">
                    {n.title}
                  </span>
                  {!n.isRead && (
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  )}
                </div>
                <p className="line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">
                  {notificationText(n)}
                </p>
                <time className="text-[11px] text-zinc-400">
                  {formatRelative(n.createdAt)}
                </time>
              </button>
            ))}
          </div>

          <Link
            href="/notifications"
            onClick={() => setOpen(false)}
            className="block border-t border-zinc-100 px-4 py-2.5 text-center text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Lihat semua
          </Link>
        </div>
      )}
    </div>
  );
}

function formatRelative(iso: string) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "baru saja";
  if (mins < 60) return `${mins} mnt lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return d.toLocaleDateString("id-ID");
}
