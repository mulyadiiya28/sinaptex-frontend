import { apiClient } from "@/lib/api-client";
import { ChatMessage, Conversation } from "./chat.schema";

// conversations + messages (README engine bagian 6)
export const chatApi = {
  listConversations: () => apiClient.get<Conversation[]>("/api/v1/chat/conversations"),
  listMessages: (conversationId: string) =>
    apiClient.get<ChatMessage[]>(`/api/v1/chat/conversations/${conversationId}/messages`),
  // Kirim pesan sebaiknya lewat Socket.IO event `message:send` (real-time),
  // endpoint REST ini dipakai untuk upload media (multipart) — lihat chat-socket.ts.
};
