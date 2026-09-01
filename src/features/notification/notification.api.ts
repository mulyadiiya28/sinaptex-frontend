import { apiClient } from "@/lib/api-client";
import { AppNotification } from "./notification.schema";

// Engine routes:
//   GET  /api/v1/notifications/me
//   PATCH /api/v1/notifications/:id/read

export const notificationApi = {
  list: () => apiClient.get<AppNotification[]>("/api/v1/notifications/me"),
  markRead: (id: string) =>
    apiClient.patch<AppNotification>(`/api/v1/notifications/${id}/read`, {}),
};
