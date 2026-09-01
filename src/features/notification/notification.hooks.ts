"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "./notification.api";
import { AppNotification } from "./notification.schema";

export const notificationKeys = {
  all: ["notifications"] as const,
};

export function useNotifications(enabled = true) {
  return useQuery({
    queryKey: notificationKeys.all,
    queryFn: notificationApi.list,
    enabled,
    staleTime: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function useUnreadNotificationCount(enabled = true) {
  const { data } = useNotifications(enabled);
  return data?.filter((n) => !n.isRead).length ?? 0;
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });
      const prev = queryClient.getQueryData<AppNotification[]>(notificationKeys.all);
      queryClient.setQueryData<AppNotification[]>(notificationKeys.all, (old) =>
        old?.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      return { prev };
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(notificationKeys.all, ctx.prev);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

/** Sisipkan notifikasi baru dari socket ke cache (paling atas, dedupe by id). */
export function prependNotification(
  queryClient: ReturnType<typeof useQueryClient>,
  notification: AppNotification
) {
  queryClient.setQueryData<AppNotification[]>(notificationKeys.all, (old) => {
    const list = old ?? [];
    if (list.some((n) => n.id === notification.id)) return list;
    return [notification, ...list];
  });
}
