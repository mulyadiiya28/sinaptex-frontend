import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "./notification.api";

const notificationKeys = { all: ["notifications"] as const };

export function useNotifications() {
  return useQuery({ queryKey: notificationKeys.all, queryFn: notificationApi.list });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: notificationKeys.all }),
  });
}
