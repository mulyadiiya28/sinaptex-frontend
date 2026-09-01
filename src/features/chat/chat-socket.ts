import { useEffect, useState } from "react";
import { connectSocket, disconnectSocket } from "@/lib/socket-client";
import { ChatMessage } from "./chat.schema";

/**
 * Hook koneksi chat real-time. Contoh pemakaian sesuai README engine
 * bagian "Socket.IO (ringkas)".
 */
export function useChatSocket(conversationId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!conversationId) return;

    let active = true;

    connectSocket().then((socket) => {
      if (!active) return;
      socket.on("message:new", (message: ChatMessage) => {
        if (message.conversationId === conversationId) {
          setMessages((prev) => [...prev, message]);
        }
      });
    });

    return () => {
      active = false;
      disconnectSocket();
    };
  }, [conversationId]);

  const sendMessage = async (content: string) => {
    if (!conversationId) return;
    const socket = await connectSocket();
    socket.emit("message:send", { conversationId, content }, () => {});
  };

  return { messages, sendMessage };
}
