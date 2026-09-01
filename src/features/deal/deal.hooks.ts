import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dealApi } from "./deal.api";
import { DealStatus } from "./deal.schema";

const dealKeys = { all: ["deals"] as const };

export function useDeals() {
  return useQuery({ queryKey: dealKeys.all, queryFn: dealApi.list });
}

export function useUpdateDealStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: DealStatus }) =>
      dealApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: dealKeys.all }),
  });
}
