import { io, Socket } from "socket.io-client";
import { getAccessToken } from "@/lib/supabase-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

let socket: Socket | null = null;

/**
 * Socket.IO singleton untuk chat real-time. Dipasang di port yang sama dengan
 * API (lihat README engine bagian "Chat WebSocket").
 * Panggil `connectSocket()` setelah user login, dan `disconnectSocket()` saat logout.
 */
export async function connectSocket(): Promise<Socket> {
  if (socket?.connected) return socket;

  const token = await getAccessToken();

  socket = io(SOCKET_URL, {
    auth: { token },
    autoConnect: true,
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket(): Socket | null {
  return socket;
}
