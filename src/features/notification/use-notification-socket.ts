"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket-client";
import { useSessionStore } from "@/store/use-session-store";
import { sendLocalNotification } from "@/lib/push-manager";
import { AppNotification, notificationText } from "./notification.schema";
import { prependNotification } from "./notification.hooks";

/**
 * Hubungkan Socket.IO saat user login dan listen event `notification:new`
 * dari engine (room profile:{profileId}).
 *
 * Pasang sekali di AuthProvider.
 */
export function useNotificationSocket() {
  const queryClient = useQueryClient();
  const me = useSessionStore((s) => s.me);

  useEffect(() => {
    if (!me) {
      disconnectSocket();
      return;
    }

    let cancelled = false;

    const onNotification = (payload: AppNotification) => {
      const createdAt =
        typeof payload.createdAt === "string"
          ? payload.createdAt
          : new Date(payload.createdAt as unknown as string).toISOString();

      prependNotification(queryClient, {
        ...payload,
        isRead: payload.isRead ?? false,
        createdAt,
      });

      // Show native OS / Web Push Notification if permission granted
      try {
        const text = notificationText(payload);
        sendLocalNotification(payload.title || "Sinaptex Notifikasi", {
          body: text || "Ada aktivitas baru pada akun bisnis Anda.",
          url: "/notifications",
        });
      } catch {
        // non-blocking
      }
    };

    connectSocket().then((socket) => {
      if (cancelled) return;
      socket.off("notification:new", onNotification);
      socket.on("notification:new", onNotification);
    });

    return () => {
      cancelled = true;
      const s = getSocket();
      s?.off("notification:new", onNotification);
    };
  }, [me, queryClient]);
}
