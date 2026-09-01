import { apiClient } from "@/lib/api-client";
import { ActivateBoostInput, BoostPlan } from "./boost.schema";

// plans + activate (README engine bagian 6)
export const boostApi = {
  plans: () => apiClient.get<BoostPlan[]>("/api/v1/boosts/plans"),
  activate: (input: ActivateBoostInput) => apiClient.post<void>("/api/v1/boosts/activate", input),
};
