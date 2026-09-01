import { apiClient } from "@/lib/api-client";
import { Deal, DealStatus } from "./deal.schema";

// list, patch status (README engine bagian 6, "invitations/deals")
export const dealApi = {
  list: () => apiClient.get<Deal[]>("/api/v1/invitations/deals"),
  updateStatus: (id: string, status: DealStatus) =>
    apiClient.patch<Deal>(`/api/v1/invitations/deals/${id}`, { status }),
};
