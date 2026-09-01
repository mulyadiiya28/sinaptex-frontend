import { useQuery } from "@tanstack/react-query";
import { matchingApi } from "./matching.api";

export function useMatching(opportunityId: string) {
  return useQuery({
    queryKey: ["matching", opportunityId],
    queryFn: () => matchingApi.run(opportunityId),
    enabled: Boolean(opportunityId),
  });
}
