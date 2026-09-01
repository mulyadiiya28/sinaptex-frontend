import { z } from "zod";

// originType NEED tanpa gate membership; OFFER/PROFILE saat ini masih gate
// membership di chat.policy.js versi production (lihat README engine bagian 4).
export const chatOriginTypeSchema = z.enum(["NEED", "OFFER", "PROFILE"]);
export type ChatOriginType = z.infer<typeof chatOriginTypeSchema>;

export const messageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  senderId: z.string(),
  content: z.string(),
  createdAt: z.string(),
});
export type ChatMessage = z.infer<typeof messageSchema>;

export const conversationSchema = z.object({
  id: z.string(),
  originType: chatOriginTypeSchema,
  opportunityId: z.string().nullable().optional(),
  lastMessage: messageSchema.nullable().optional(),
});
export type Conversation = z.infer<typeof conversationSchema>;

export const sendMessageSchema = z.object({
  conversationId: z.string(),
  content: z.string().min(1, "Pesan tidak boleh kosong").max(2000),
});
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
