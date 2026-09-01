import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "./profile.api";
import { UpdateProfileInput } from "./profile.schema";

const profileKeys = { detail: ["profile"] as const };

export function useProfile() {
  return useQuery({ queryKey: profileKeys.detail, queryFn: profileApi.get });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => profileApi.update(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: profileKeys.detail }),
  });
}
