import { apiClient } from "@/lib/api-client";
import { CreateInvitationInput, Invitation } from "./invitation.schema";

// create, respond (README engine bagian 6)
export const invitationApi = {
  create: (input: CreateInvitationInput) =>
    apiClient.post<Invitation>("/api/v1/invitations", input),
  respond: (id: string, action: "ACCEPTED" | "REJECTED") =>
    apiClient.patch<Invitation>(`/api/v1/invitations/${id}/respond`, { action }),
  list: () => apiClient.get<Invitation[]>("/api/v1/invitations"),
};
