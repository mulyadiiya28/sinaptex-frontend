import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { boostApi } from "./boost.api";
import { ActivateBoostInput } from "./boost.schema";

export function useBoostPlans() {
  return useQuery({ queryKey: ["boosts", "plans"], queryFn: boostApi.plans });
}

export function useActivateBoost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ActivateBoostInput) => boostApi.activate(input),
    // ✅ Fix: Invalidate opportunity setelah boost diaktifkan
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["opportunities", "detail", variables.opportunityId] });
      queryClient.invalidateQueries({ queryKey: ["opportunities"] });
    },
  });
}