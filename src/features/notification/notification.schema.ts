import { z } from "zod";

// Sesuai notification.listener.js di engine
export const notificationTypeSchema = z.enum([
  "CHAT_MESSAGE",
  "REVIEW_RECEIVED",
  "VERIFICATION_STATUS",
  "DEAL_UPDATE",
  "INVITATION_NEW",
  "MEMBERSHIP_REMINDER",
  "VERIFICATION_RESULT",
]);
export type NotificationType = z.infer<typeof notificationTypeSchema>;

export const notificationSchema = z.object({
  id: z.string(),
  type: z.string(),
  title: z.string(),
  message: z.string().optional().nullable(),
  /** Alias legacy — beberapa payload lama pakai body */
  body: z.string().optional().nullable(),
  isRead: z.boolean().default(false),
  data: z.record(z.string(), z.unknown()).nullable().optional(),
  profileId: z.string().optional(),
  createdAt: z.string(),
});
export type AppNotification = z.infer<typeof notificationSchema>;

export function notificationText(n: AppNotification): string {
  return n.message ?? n.body ?? "";
}
