import { apiClient } from "@/lib/api-client";
import { ActivateBoostInput, BoostPlan } from "./boost.schema";

// plans + checkout (README engine bagian 6 & OpenAPI /boosts/plans & /boosts/{id}/checkout)
export const boostApi = {
  plans: () => apiClient.get<BoostPlan[]>("/api/v1/boosts/plans"),
  activate: (input: ActivateBoostInput) =>
    apiClient.post<{ checkoutUrl?: string; success?: boolean }>(
      `/api/v1/boosts/${input.opportunityId}/checkout`,
      { planId: input.planId }
    ),
};
