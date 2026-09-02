import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateReviewInput) => reviewApi.create(input),
    // ✅ Fix: Invalidate review list setelah create agar UI ter-update
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", "party"] });
      queryClient.invalidateQueries({ queryKey: ["deals"] });
    },
  });
}