import { useMutation, useQuery } from "@tanstack/react-query";
import { reviewApi } from "./review.api";
import { CreateReviewInput } from "./review.schema";

export function usePartyReviews(partyId: string) {
  return useQuery({
    queryKey: ["reviews", "party", partyId],
    queryFn: () => reviewApi.listForParty(partyId),
    enabled: Boolean(partyId),
  });
}

export function useCreateReview() {
  return useMutation({
    mutationFn: (input: CreateReviewInput) => reviewApi.create(input),
  });
}
