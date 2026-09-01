import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { verificationApi } from "./verification.api";
import { SubmitVerificationInput } from "./verification.schema";

const verificationKeys = { mine: ["verification", "me"] as const };

export function useMyVerifications() {
  return useQuery({ queryKey: verificationKeys.mine, queryFn: verificationApi.mine });
}

export function useSubmitVerification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SubmitVerificationInput) => verificationApi.submit(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: verificationKeys.mine }),
  });
}
