import { useMutation, useQuery } from "@tanstack/react-query";
import { boostApi } from "./boost.api";
import { ActivateBoostInput } from "./boost.schema";

export function useBoostPlans() {
  return useQuery({ queryKey: ["boosts", "plans"], queryFn: boostApi.plans });
}

export function useActivateBoost() {
  return useMutation({
    mutationFn: (input: ActivateBoostInput) => boostApi.activate(input),
  });
}
