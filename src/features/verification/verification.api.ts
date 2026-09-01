import { apiClient } from "@/lib/api-client";
import { SubmitVerificationInput, Verification } from "./verification.schema";

// upload + review admin (README engine bagian 6)
export const verificationApi = {
  submit: (input: SubmitVerificationInput) =>
    apiClient.post<Verification>("/api/v1/verification", input),
  mine: () => apiClient.get<Verification[]>("/api/v1/verification/me"),
};
