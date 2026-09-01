import { apiClient } from "@/lib/api-client";
import { CreateReviewInput, Review } from "./review.schema";

export const reviewApi = {
  create: (input: CreateReviewInput) => apiClient.post<Review>("/api/v1/reviews", input),
  listForParty: (partyId: string) => apiClient.get<Review[]>(`/api/v1/reviews/party/${partyId}`),
};
