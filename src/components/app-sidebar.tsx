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
} from "lucide-react";
import { useUIStore } from "@/store/use-ui-store";

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
  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);

  if (!isSidebarOpen) return null;

  return (
    <aside className="hidden w-56 shrink-0 border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900 md:flex md:flex-col">
      <div className="flex h-14 items-center border-b border-zinc-200 px-4 dark:border-zinc-800">
        <Link href="/dashboard" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
          Sinaptex
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
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
    </aside>
  );
}
