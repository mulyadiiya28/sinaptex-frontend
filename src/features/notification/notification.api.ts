import { apiClient } from "@/lib/api-client";
import { AppNotification } from "./notification.schema";

export const notificationApi = {
  list: () => apiClient.get<AppNotification[]>("/api/v1/notifications"),
  markRead: (id: string) => apiClient.patch<void>(`/api/v1/notifications/${id}/read`, {}),
};
