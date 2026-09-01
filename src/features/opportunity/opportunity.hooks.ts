import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { opportunityApi } from "./opportunity.api";
import {
  CreateOpportunityInput,
  OPPORTUNITY_QUOTA_EXCEEDED,
  OpportunityType,
} from "./opportunity.schema";

export const opportunityKeys = {
  all: ["opportunities"] as const,
  list: (params?: { type?: OpportunityType; mine?: boolean }) =>
    ["opportunities", "list", params] as const,
  detail: (id: string) => ["opportunities", "detail", id] as const,
};

export function useOpportunities(params?: { type?: OpportunityType; mine?: boolean }) {
  return useQuery({
    queryKey: opportunityKeys.list(params),
    queryFn: () => opportunityApi.list(params),
  });
}

export function useOpportunity(id: string) {
  return useQuery({
    queryKey: opportunityKeys.detail(id),
    queryFn: () => opportunityApi.get(id),
    enabled: Boolean(id),
  });
}

/**
 * Quota berdasarkan status membership (README engine bagian 3):
 * non-member 1 ACTIVE Need + 1 ACTIVE Offer, member aktif 20 + 20.
 * Backend melempar `OPPORTUNITY_QUOTA_EXCEEDED` saat quota habis — tangkap
 * pesan ini di UI untuk arahkan user upgrade membership.
 */
export function useCreateOpportunity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateOpportunityInput) => opportunityApi.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: opportunityKeys.all });
    },
    onError: (error: Error) => {
      if (error.message.includes(OPPORTUNITY_QUOTA_EXCEEDED)) {
        // Lempar ulang dengan pesan ramah pengguna; komponen pemanggil
        // bisa menampilkan CTA upgrade membership.
        throw new Error(
          "Kuota posting aktif sudah penuh. Tutup posting lama atau upgrade membership."
        );
      }
      throw error;
    },
  });
}
