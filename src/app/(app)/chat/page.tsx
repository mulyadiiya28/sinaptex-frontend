"use client";

import { useState, useMemo, useRef, use } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Send,
  User,
  Briefcase,
  Search,
  Sparkles,
} from "lucide-react";
import { useConversations, useMessages } from "@/features/chat/chat.hooks";
import { useChatSocket } from "@/features/chat/chat-socket";
import { ChatMessage, Conversation } from "@/features/chat/chat.schema";
import { useSessionStore } from "@/store/use-session-store";

export default function ChatPage({
  searchParams,
}: {
  searchParams?: Promise<{ opportunityId?: string; conversationId?: string }>;
}) {
  const resolvedParams = searchParams ? use(searchParams) : undefined;
  const targetOppId = resolvedParams?.opportunityId;
  const initialConvId = resolvedParams?.conversationId;

  const me = useSessionStore((s) => s.me);
  const { data: conversations, isLoading: isConvsLoading } = useConversations();

  const [selectedConvId, setSelectedConvId] = useState<string | null>(initialConvId ?? null);
  const [inputText, setInputText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sentMessages, setSentMessages] = useState<ChatMessage[]>([]);

  // Compute active conversation ID
  const activeConvId = useMemo(() => {
    if (selectedConvId) return selectedConvId;
    if (targetOppId && conversations) {
      const found = conversations.find((c) => c.opportunityId === targetOppId);
      if (found) return found.id;
    }
    return conversations?.[0]?.id ?? null;
  }, [selectedConvId, targetOppId, conversations]);

  const { data: historyMessages, isLoading: isMsgLoading } = useMessages(activeConvId);
  const { messages: socketMessages, sendMessage: sendViaSocket } = useChatSocket(activeConvId);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Combine history, socket, and locally sent messages
  const allMessages = useMemo(() => {
    const map = new Map<string, ChatMessage>();
    (historyMessages ?? []).forEach((m) => map.set(m.id, m));
    socketMessages.forEach((m) => map.set(m.id, m));
    sentMessages.filter((m) => m.conversationId === activeConvId).forEach((m) => map.set(m.id, m));
    return Array.from(map.values()).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [historyMessages, socketMessages, sentMessages, activeConvId]);

  const activeConv: Conversation | undefined = conversations?.find((c) => c.id === activeConvId);

  const filteredConversations = (conversations ?? []).filter((c) => {
    if (!searchQuery) return true;
    return (
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.originType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.opportunityId && c.opportunityId.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = inputText.trim();
    if (!text || !activeConvId) return;

    setInputText("");

    const tempMsg: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      conversationId: activeConvId,
      senderId: me?.id ?? "me",
      content: text,
      createdAt: new Date().toISOString(),
    };

    setSentMessages((prev) => [...prev, tempMsg]);

    try {
      await sendViaSocket(text);
    } catch {
      // handled
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Chat Real-Time
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Komunikasi langsung dengan calon mitra dan partner bisnis.
        </p>
      </div>

      <div className="flex h-[calc(100vh-14rem)] min-h-[500px] overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        {/* Left column: Conversation list */}
        <div className="flex w-80 shrink-0 flex-col border-r border-zinc-200 dark:border-zinc-800">
          <div className="border-b border-zinc-100 p-3 dark:border-zinc-800">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="Cari percakapan…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2 pl-9 pr-3 text-xs outline-none focus:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {isConvsLoading && (
              <div className="flex justify-center py-10">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
              </div>
            )}

            {!isConvsLoading && filteredConversations.length === 0 && (
              <div className="p-6 text-center text-xs text-zinc-500 dark:text-zinc-400">
                {targetOppId ? (
                  <div className="space-y-2">
                    <p>Memulai percakapan untuk Opportunity #{targetOppId.slice(0, 8)}</p>
                    <button
                      type="button"
                      onClick={() => setSelectedConvId(`conv_${targetOppId}`)}
                      className="rounded-lg bg-zinc-900 px-3 py-1.5 text-xs text-white dark:bg-zinc-50 dark:text-zinc-900"
                    >
                      Buka Chat Room
                    </button>
                  </div>
                ) : (
                  <p>Belum ada percakapan aktif. Temukan partner di Marketplace untuk mulai chat.</p>
                )}
              </div>
            )}

            {filteredConversations.map((conv) => {
              const active = conv.id === activeConvId;
              return (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`flex w-full items-start gap-3 border-b border-zinc-50 p-3.5 text-left transition dark:border-zinc-800/60 ${
                    active
                      ? "bg-zinc-100 dark:bg-zinc-800"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800/40"
                  }`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {conv.originType} Chat
                      </span>
                      <span className="rounded bg-zinc-200/70 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700 dark:bg-zinc-700 dark:text-zinc-300">
                        {conv.originType}
                      </span>
                    </div>
                    {conv.opportunityId && (
                      <p className="mt-0.5 truncate text-[11px] text-zinc-500 dark:text-zinc-400">
                        Opp: {conv.opportunityId.slice(0, 12)}…
                      </p>
                    )}
                    <p className="mt-1 truncate text-xs text-zinc-600 dark:text-zinc-300">
                      {conv.lastMessage?.content ?? "Percakapan baru"}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right column: Active Chat Window */}
        <div className="flex flex-1 flex-col bg-zinc-50/50 dark:bg-zinc-950/30">
          {activeConvId ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between border-b border-zinc-200 bg-white px-5 py-3.5 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                    <MessageSquare className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                      Room {activeConvId.slice(0, 12)}
                    </h2>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                      Tipe: {activeConv?.originType ?? "NEED"} · Socket.IO Terhubung
                    </p>
                  </div>
                </div>

                {activeConv?.opportunityId && (
                  <Link
                    href={`/opportunities/${activeConv.opportunityId}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 px-2.5 py-1 text-xs font-medium text-zinc-700 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  >
                    <Briefcase className="h-3 w-3" />
                    Lihat Opportunity
                  </Link>
                )}
              </div>

              {/* Chat Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {isMsgLoading && (
                  <div className="flex justify-center py-6">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900 dark:border-zinc-700 dark:border-t-zinc-100" />
                  </div>
                )}

                {allMessages.length === 0 && !isMsgLoading && (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <Sparkles className="h-8 w-8 text-zinc-400" />
                    <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
                      Mulai Percakapan
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      Kirim salam pembuka untuk berdiskusi mengenai kebutuhan atau penawaran bisnis.
                    </p>
                  </div>
                )}

                {allMessages.map((msg) => {
                  const isMe = msg.senderId === me?.id || msg.senderId === "me";
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl px-4 py-2.5 text-sm ${
                          isMe
                            ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                            : "border border-zinc-200 bg-white text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      <span className="mt-1 px-1 text-[10px] text-zinc-400">
                        {new Date(msg.createdAt).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form
                onSubmit={handleSend}
                className="border-t border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ketik pesan..."
                    className="flex-1 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none ring-zinc-900 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50 dark:ring-zinc-100"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white transition hover:bg-zinc-800 disabled:opacity-40 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex h-full flex-col items-center justify-center p-6 text-center text-zinc-500">
              <MessageSquare className="h-10 w-10 text-zinc-300 dark:text-zinc-700" />
              <p className="mt-3 text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Pilih percakapan
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                Pilih salah satu ruang obrolan di sebelah kiri untuk melihat pesan.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
