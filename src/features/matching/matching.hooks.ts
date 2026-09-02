import { useQuery } from "@tanstack/react-query";
import { matchingApi } from "./matching.api";

export function useMatching(opportunityId: string) {
  return useQuery({
    queryKey: ["matching", opportunityId],
    queryFn: () => matchingApi.run(opportunityId),
    enabled: Boolean(opportunityId),
    // ✅ Fix: Matching computation bisa mahal di backend.
    // Cache hasil selama 5 menit agar tidak di-run berulang kali.
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}