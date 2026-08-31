"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useUIStore } from "@/store/use-ui-store";

export function SidebarToggle() {
  const { isSidebarOpen, toggleSidebar } = useUIStore();

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      className="inline-flex items-center gap-2 rounded-md border border-neutral-200 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
    >
      {isSidebarOpen ? (
        <PanelLeftClose className="h-4 w-4" />
      ) : (
        <PanelLeftOpen className="h-4 w-4" />
      )}
      {isSidebarOpen ? "Tutup sidebar" : "Buka sidebar"}
    </button>
  );
}
