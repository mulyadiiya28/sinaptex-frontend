import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "./auth.api";
import { RegisterProfileInput } from "./auth.schema";

export const authKeys = {
  me: ["auth", "me"] as const,
};

export function useMe(enabled = true) {
  return useQuery({
    queryKey: authKeys.me,
    queryFn: authApi.me,
    enabled,
  });
}

export function useRegisterProfile() {
  return useMutation({
    mutationFn: (input: RegisterProfileInput) => authApi.register(input),
  });
}
