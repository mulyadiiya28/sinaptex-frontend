import { apiClient } from "@/lib/api-client";
import { Me, RegisterProfileInput } from "./auth.schema";

export const authApi = {
  register: (input: RegisterProfileInput) => 
    apiClient.post<Me>("/api/v1/auth/register", input),
  me: () => apiClient.get<Me>("/api/v1/auth/me"),
};