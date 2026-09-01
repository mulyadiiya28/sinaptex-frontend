import { apiClient } from "@/lib/api-client";
import { MatchResult } from "./matching.schema";

// GET /matching/:opportunityId/run (README engine bagian 6 & 7)
export const matchingApi = {
  run: (opportunityId: string) =>
    apiClient.get<MatchResult[]>(`/api/v1/matching/${opportunityId}/run`),
};
