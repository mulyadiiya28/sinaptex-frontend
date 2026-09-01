import { apiClient } from "@/lib/api-client";
import { Profile, UpdateProfileInput } from "./profile.schema";

export const profileApi = {
  get: () => apiClient.get<Profile>("/api/v1/profile"),
  update: (input: UpdateProfileInput) => apiClient.patch<Profile>("/api/v1/profile", input),
};
