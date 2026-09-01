import { z } from "zod";

// Ranking = match + reputation + response + completion + activity + verification + boost - penalty
export const matchResultSchema = z.object({
  opportunityId: z.string(),
  matchScore: z.number().min(0).max(100),
  rankingScore: z.number(),
  counterparty: z.object({
    partyId: z.string(),
    name: z.string(),
    avatarUrl: z.string().nullable().optional(),
  }),
});
export type MatchResult = z.infer<typeof matchResultSchema>;
