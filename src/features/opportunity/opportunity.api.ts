import { apiClient } from "@/lib/api-client";
import { CreateOpportunityInput, Opportunity, OpportunityType } from "./opportunity.schema";

// Endpoint: CRUD + media, prefix umumnya /api/v1/opportunities (lihat README engine bagian 6)

export const opportunityApi = {
  list: (params?: { type?: OpportunityType; mine?: boolean }) =>
    apiClient.get<Opportunity[]>("/api/v1/opportunities", {
      params: {
        ...(params?.type ? { type: params.type } : {}),
        ...(params?.mine ? { mine: "true" } : {}),
      },
    }),
  get: (id: string) => apiClient.get<Opportunity>(`/api/v1/opportunities/${id}`),
  create: (input: CreateOpportunityInput) =>
    apiClient.post<Opportunity>("/api/v1/opportunities", input),
  update: (id: string, input: Partial<CreateOpportunityInput>) =>
    apiClient.patch<Opportunity>(`/api/v1/opportunities/${id}`, input),
  close: (id: string) => apiClient.patch<Opportunity>(`/api/v1/opportunities/${id}`, { status: "CLOSED" }),
  remove: (id: string) => apiClient.delete<void>(`/api/v1/opportunities/${id}`),
};
