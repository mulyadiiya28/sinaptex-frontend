import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { profileApi } from "./profile.api";
import { UpdateProfileInput } from "./profile.schema";
import { useSessionStore } from "@/store/use-session-store";

const profileKeys = { detail: ["profile"] as const };

export function useProfile() {
  return useQuery({ queryKey: profileKeys.detail, queryFn: profileApi.get });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setMe = useSessionStore((s) => s.setMe);

  return useMutation({
    mutationFn: (input: UpdateProfileInput) => profileApi.update(input),
    onSuccess: (data) => {
      // ✅ Fix: Sync profile update ke session store agar header/UI ter-update
      setMe(data);
      queryClient.invalidateQueries({ queryKey: profileKeys.detail });
    },
  });
}