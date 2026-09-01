import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { invitationApi } from "./invitation.api";
import { CreateInvitationInput } from "./invitation.schema";

const invitationKeys = { all: ["invitations"] as const };

export function useInvitations() {
  return useQuery({ queryKey: invitationKeys.all, queryFn: invitationApi.list });
}

export function useCreateInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateInvitationInput) => invitationApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: invitationKeys.all }),
  });
}

export function useRespondInvitation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, action }: { id: string; action: "ACCEPTED" | "REJECTED" }) =>
      invitationApi.respond(id, action),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: invitationKeys.all }),
  });
}
