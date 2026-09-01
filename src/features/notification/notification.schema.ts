import { z } from "zod";

// FR-12: notifikasi invitation baru, deal update, chat baru (jika offline >5 menit),
// reminder membership (H-3 / H-1), hasil review verifikasi.
export const notificationTypeSchema = z.enum([
  "INVITATION_NEW",
  "DEAL_UPDATE",
  "CHAT_MESSAGE",
  "MEMBERSHIP_REMINDER",
  "VERIFICATION_RESULT",
]);
export type NotificationType = z.infer<typeof notificationTypeSchema>;

export const notificationSchema = z.object({
  id: z.string(),
  type: notificationTypeSchema,
  title: z.string(),
  body: z.string(),
  isRead: z.boolean(),
  createdAt: z.string(),
});
export type AppNotification = z.infer<typeof notificationSchema>;
