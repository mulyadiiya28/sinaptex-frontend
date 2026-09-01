import { useEffect, useState, useRef, useCallback } from "react";
import { connectSocket, getSocket } from "@/lib/socket-client";
import { ChatMessage } from "./chat.schema";

export interface TypingUser {
  userId?: string;
  userName?: string;
  conversationId: string;
}

/**
 * Hook koneksi chat real-time dengan dukungan typing indicators.
 */
export function useChatSocket(conversationId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState<TypingUser | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    let active = true;

    connectSocket().then((socket) => {

      if (!active) return;

      // Listen for incoming messages
      socket.on("message:new", (message: ChatMessage) => {
        if (message.conversationId === conversationId) {
          setMessages((prev) => [...prev, message]);
          // If receiving a new message, clear typing indicator immediately
          setIsTyping(false);
          setTypingUser(null);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
          }
        }
      });

      // Handle typing events (standard Socket.IO event naming patterns)
      const handleTypingStart = (data?: { conversationId?: string; userId?: string; userName?: string; name?: string }) => {
        if (!data || data.conversationId === conversationId) {
          setIsTyping(true);
          setTypingUser({
            conversationId,
            userId: data?.userId,
            userName: data?.userName || data?.name || "Partner",
          });

          // Auto-clear typing indicator after 3.5 seconds of inactivity
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
          }
          typingTimeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            setTypingUser(null);
          }, 3500);
        }
      };

      const handleTypingStop = (data?: { conversationId?: string }) => {
        if (!data || data.conversationId === conversationId) {
          setIsTyping(false);
          setTypingUser(null);
          if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = null;
          }
        }
      };

      socket.on("typing:start", handleTypingStart);
      socket.on("typing:stop", handleTypingStop);
      socket.on("chat:typing", handleTypingStart);
      socket.on("chat:stop_typing", handleTypingStop);
      socket.on("user:typing", handleTypingStart);
      socket.on("user:stop_typing", handleTypingStop);
    });

    return () => {
      active = false;
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      const socket = getSocket();
      if (socket) {
        socket.off("message:new");
        socket.off("typing:start");
        socket.off("typing:stop");
        socket.off("chat:typing");
        socket.off("chat:stop_typing");
        socket.off("user:typing");
        socket.off("user:stop_typing");
      }
    };
  }, [conversationId]);

  const sendMessage = async (content: string) => {
    if (!conversationId) return;
    const socket = await connectSocket();
    socket.emit("message:send", { conversationId, content }, () => {});
    socket.emit("typing:stop", { conversationId });
    socket.emit("chat:stop_typing", { conversationId });
  };

  const sendTyping = useCallback(
    async (isTypingState: boolean) => {
      if (!conversationId) return;
      const socket = await connectSocket();
      if (isTypingState) {
        socket.emit("typing:start", { conversationId });
        socket.emit("chat:typing", { conversationId });
      } else {
        socket.emit("typing:stop", { conversationId });
        socket.emit("chat:stop_typing", { conversationId });
      }
    },
    [conversationId]
  );

  return { messages, sendMessage, isTyping, typingUser, sendTyping };
}

