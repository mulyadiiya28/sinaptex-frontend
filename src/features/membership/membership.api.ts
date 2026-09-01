import { apiClient } from "@/lib/api-client";
import { MembershipPlan, MembershipStatus } from "./membership.schema";

// plans, checkout, webhook (README engine bagian 6; webhook ditangani backend)
export const membershipApi = {
  plans: () => apiClient.get<MembershipPlan[]>("/api/v1/membership/plans"),
  status: () => apiClient.get<MembershipStatus>("/api/v1/membership/status"),
  checkout: (planId: string) =>
    apiClient.post<{ checkoutUrl: string }>("/api/v1/membership/checkout", { planId }),
};
