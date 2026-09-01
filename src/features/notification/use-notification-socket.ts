"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { connectSocket, disconnectSocket, getSocket } from "@/lib/socket-client";
import { useSessionStore } from "@/store/use-session-store";
import { AppNotification } from "./notification.schema";
import { prependNotification } from "./notification.hooks";

/**
 * Hubungkan Socket.IO saat user login dan listen event `notification:new`
 * dari engine (room profile:{profileId}).
 *
 * Pasang sekali di AuthProvider / root client tree.
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

    connectSocket().then((socket) => {
      if (cancelled) return;

      const onNotification = (payload: AppNotification) => {
        prependNotification(queryClient, {
          ...payload,
          isRead: payload.isRead ?? false,
          createdAt:
            typeof payload.createdAt === "string"
              ? payload.createdAt
              : new Date(payload.createdAt as unknown as string).toISOString(),
        });
      };

      socket.on("notification:new", onNotification);

      // Cleanup listener saat effect re-run (jangan disconnect di sini —
      // disconnect hanya saat logout / me null)
      socket.off?.("notification:new"); // ensure no duplicate from hot reload
      socket.on("notification:new", onNotification);
    });

    return () => {
      cancelled = true;
      const s = getSocket();
      s?.off("notification:new");
    };
  }, [me, queryClient]);
}
