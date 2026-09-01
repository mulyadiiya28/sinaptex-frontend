import { getAccessToken } from "@/lib/supabase-client";

/**
 * Base URL API engine. Default port 4000 sesuai README engine (Sinaptex — API Engine).
 */
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ApiEnvelope<T> = {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
};

type FetchOptions = RequestInit & {
  params?: Record<string, string | number | boolean | undefined>;
  auth?: boolean;
};

function buildUrl(path: string, params?: FetchOptions["params"]) {
  const url = new URL(path, BASE_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
}

async function requestRaw<T>(path: string, options: FetchOptions = {}): Promise<ApiEnvelope<T> | T> {
  const { params, auth = true, headers, ...init } = options;

  const authHeaders: Record<string, string> = {};
  if (auth) {
    const token = await getAccessToken();
    if (token) authHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(buildUrl(path, params), {
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
      // response bukan JSON
    }
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<ApiEnvelope<T> | T>;
}

/** Ambil `data` dari envelope engine; fallback ke body mentah jika bukan envelope. */
async function request<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const body = await requestRaw<T>(path, options);
  if (body && typeof body === "object" && "success" in body && "data" in body) {
    return (body as ApiEnvelope<T>).data;
  }
  return body as T;
}

/** Sama seperti request, tapi ikut mengembalikan `meta` pagination jika ada. */
async function requestWithMeta<T>(
  path: string,
  options: FetchOptions = {}
): Promise<{ data: T; meta?: PaginationMeta }> {
  const body = await requestRaw<T>(path, options);
  if (body && typeof body === "object" && "success" in body && "data" in body) {
    const env = body as ApiEnvelope<T>;
    return { data: env.data, meta: env.meta };
  }
  return { data: body as T };
}

export const apiClient = {
  get: <T,>(path: string, options?: FetchOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  getWithMeta: <T,>(path: string, options?: FetchOptions) =>
    requestWithMeta<T>(path, { ...options, method: "GET" }),
  post: <T,>(path: string, body?: unknown, options?: FetchOptions) =>
    request<T>(path, { ...options, method: "POST", body: JSON.stringify(body) }),
  put: <T,>(path: string, body?: unknown, options?: FetchOptions) =>
    request<T>(path, { ...options, method: "PUT", body: JSON.stringify(body) }),
  patch: <T,>(path: string, body?: unknown, options?: FetchOptions) =>
    request<T>(path, { ...options, method: "PATCH", body: JSON.stringify(body) }),
  delete: <T,>(path: string, options?: FetchOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};
