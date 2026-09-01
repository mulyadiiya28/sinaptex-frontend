import { z } from "zod";

export const createReviewSchema = z.object({
  dealId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});
export type CreateReviewInput = z.infer<typeof createReviewSchema>;

export const reviewSchema = z.object({
  id: z.string(),
  dealId: z.string(),
  rating: z.number(),
  comment: z.string().nullable().optional(),
  createdAt: z.string(),
});
export type Review = z.infer<typeof reviewSchema>;
