import { apiClient } from "@/lib/api-client";
import { Me, RegisterProfileInput } from "./auth.schema";

// Endpoint sesuai README engine bagian 5 & 6:
// POST /api/auth/register (Bearer, sinkron users+profiles setelah Supabase sign up)
// GET  /api/auth/me

export const authApi = {
  register: (input: RegisterProfileInput) => apiClient.post<Me>("/api/auth/register", input),
  me: () => apiClient.get<Me>("/api/auth/me"),
};
