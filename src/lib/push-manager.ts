// Utilities for PWA and Web Push Notifications with Serwist Service Worker

export type NotificationPermissionState = "granted" | "denied" | "default" | "unsupported";

export function isPushSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in navigator && "Notification" in window;
}

export function getNotificationPermission(): NotificationPermissionState {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "unsupported";
  }
  return Notification.permission as NotificationPermissionState;
}

export async function requestNotificationPermission(): Promise<NotificationPermissionState> {
  if (!isPushSupported()) {
    return "unsupported";
  }

  try {
    const permission = await Notification.requestPermission();
    return permission as NotificationPermissionState;
  } catch (error) {
    console.error("Failed to request notification permission:", error);
    return Notification.permission as NotificationPermissionState;
  }
}

export async function sendLocalNotification(
  title: string,
  options: {
    body?: string;
    url?: string;
    icon?: string;
    badge?: string;
    tag?: string;
  } = {}
): Promise<boolean> {
  if (!isPushSupported()) return false;

  if (Notification.permission !== "granted") {
    const perm = await requestNotificationPermission();
    if (perm !== "granted") return false;
  }

  const payloadOptions: NotificationOptions = {
    body: options.body || "Pembaruan aktivitas bisnis di Sinaptex.",
    icon: options.icon || "/icons/icon-192x192.svg",
    badge: options.badge || "/icons/badge-72x72.svg",
    tag: options.tag || `sinaptex-${Date.now()}`,
    data: {
      url: options.url || "/",
    },
  };

  try {
    // Prefer service worker registration if active
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.ready;
      if (reg && "showNotification" in reg) {
        await reg.showNotification(title, payloadOptions);
        return true;
      }
    }

    // Fallback to Window Notification API
    new Notification(title, payloadOptions);
    return true;
  } catch (err) {
    console.error("Failed to show local notification:", err);
    try {
      new Notification(title, payloadOptions);
      return true;
    } catch {
      return false;
    }
  }
}

export async function registerSerwistServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });

    // Check for updates
    registration.addEventListener("updatefound", () => {
      const installingWorker = registration.installing;
      if (installingWorker) {
        installingWorker.addEventListener("statechange", () => {
          if (
            installingWorker.state === "installed" &&
            navigator.serviceWorker.controller
          ) {
            console.log("[Serwist] New content is available and will be used when all tabs are closed.");
          }
        });
      }
    });

    return registration;
  } catch (error) {
    console.warn("[Serwist] Service worker registration failed:", error);
    return null;
  }
}
