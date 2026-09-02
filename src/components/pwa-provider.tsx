"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  getNotificationPermission,
  requestNotificationPermission,
  sendLocalNotification,
  registerSerwistServiceWorker,
  subscribeToPush,
  NotificationPermissionState,
} from "@/lib/push-manager";
import { WifiOff, Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

interface PWAContextType {
  isInstalled: boolean;
  isInstallable: boolean;
  promptInstall: () => Promise<void>;
  permission: NotificationPermissionState;
  requestPermission: () => Promise<NotificationPermissionState>;
  sendTestNotification: (title?: string, body?: string, url?: string) => Promise<boolean>;
  isOnline: boolean;
}

const PWAContext = createContext<PWAContextType>({
  isInstalled: false,
  isInstallable: false,
  promptInstall: async () => {},
  permission: "default",
  requestPermission: async () => "default",
  sendTestNotification: async () => false,
  isOnline: true,
});

export function usePWA() {
  return useContext(PWAContext);
}

export function PwaProvider({ children }: { children: React.ReactNode }) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true
    );
  });
  const [permission, setPermission] = useState<NotificationPermissionState>(() => {
    if (typeof window === "undefined") return "default";
    return getNotificationPermission();
  });
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return navigator.onLine;
  });
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [showOfflineBanner, setShowOfflineBanner] = useState(false);

  useEffect(() => {
    // 1. Register Serwist Service Worker
    registerSerwistServiceWorker();

    // 2. Online/Offline status listeners
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineBanner(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineBanner(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // 3. Handle beforeinstallprompt event for PWA installation
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      const dismissed = sessionStorage.getItem("sinaptex_install_dismissed");
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      if (!dismissed && !isStandalone) {
        setShowInstallBanner(true);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setShowInstallBanner(false);
      console.log("[PWA] Sinaptex was installed successfully.");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  async function promptInstall() {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setDeferredPrompt(null);
        setShowInstallBanner(false);
      }
    } catch (err) {
      console.warn("PWA install prompt error:", err);
    }
  }

  async function handleRequestPermission(): Promise<NotificationPermissionState> {
    const perm = await requestNotificationPermission();
    setPermission(perm);

    if (perm === "granted") {
      // Send welcome push notification
      await sendLocalNotification("Notifikasi Sinaptex Aktif! 🚀", {
        body: "Anda akan menerima pemberitahuan instan untuk update match, deal, dan pesan baru.",
        url: "/notifications",
      });

      // ✅ Subscribe ke Push Service dengan VAPID
      try {
        await subscribeToPush();
      } catch {
        // non-blocking
      }
    }

    return perm;
  }

  async function handleSendTestNotification(
    title = "Notifikasi Uji Coba Sinaptex",
    body = "Push notification dan Serwist Service Worker berfungsi normal!",
    url = "/opportunities"
  ): Promise<boolean> {
    return sendLocalNotification(title, { body, url });
  }

  function handleDismissInstall() {
    setShowInstallBanner(false);
    sessionStorage.setItem("sinaptex_install_dismissed", "true");
  }

  return (
    <PWAContext.Provider
      value={{
        isInstalled,
        isInstallable: Boolean(deferredPrompt),
        promptInstall,
        permission,
        requestPermission: handleRequestPermission,
        sendTestNotification: handleSendTestNotification,
        isOnline,
      }}
    >
      {children}

      {/* Offline Status Alert */}
      {showOfflineBanner && (
        <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto flex max-w-md items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-sm text-amber-900 shadow-lg dark:border-amber-800 dark:bg-amber-950/80 dark:text-amber-200">
          <div className="flex items-center gap-2.5">
            <WifiOff className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
            <span>Mode Offline — Konten tersimpan di cache Serwist.</span>
          </div>
          <button
            type="button"
            onClick={() => setShowOfflineBanner(false)}
            className="rounded p-1 text-amber-700 hover:bg-amber-100 dark:text-amber-300 dark:hover:bg-amber-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* PWA Install Floating Banner */}
      {showInstallBanner && !isInstalled && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl transition-all dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900">
                <Download className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                  Pasang Aplikasi Sinaptex
                </h4>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  Akses lebih cepat & dapatkan notifikasi real-time langsung di perangkat Anda.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDismissInstall}
              className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
              aria-label="Tutup prompt"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleDismissInstall}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              Nanti Saja
            </button>
            <button
              type="button"
              onClick={promptInstall}
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              <Download className="h-3.5 w-3.5" />
              Pasang Sekarang
            </button>
          </div>
        </div>
      )}
    </PWAContext.Provider>
  );
}