import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { LoginInput } from "@/schemas/auth.schema";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export function useLogin() {
  return useMutation({
    mutationFn: (input: LoginInput) => apiClient.post<LoginResponse>("/auth/login", input),
  });
}
