import { getAccessToken } from "@/lib/supabase-client";

/**
 * Base URL API engine. Default port 4000 sesuai README engine (Sinaptex — API Engine).
 * Banyak endpoint ada di prefix /api/v1, sebagian lain di /api langsung — lihat
 * "Ringkasan endpoint" pada README engine.
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

type FetchOptions = RequestInit & { params?: Record<string, string>; auth?: boolean };

async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { params, auth = true, headers, ...init } = options;
  const url = new URL(path, BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  }

  const authHeaders: Record<string, string> = {};
  if (auth) {
    const token = await getAccessToken();
    if (token) authHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url.toString(), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...headers,
    },
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body?.message ?? body?.error ?? message;
    } catch {
      // response bukan JSON, pakai statusText
    }
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T,>(path: string, options?: FetchOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T,>(path: string, body?: unknown, options?: FetchOptions) =>
    request<T>(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: <T,>(path: string, body?: unknown, options?: FetchOptions) =>
    request<T>(path, { ...options, method: "PUT", body: JSON.stringify(body) }),
  patch: <T,>(path: string, body?: unknown, options?: FetchOptions) =>
    request<T>(path, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: <T,>(path: string, options?: FetchOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
