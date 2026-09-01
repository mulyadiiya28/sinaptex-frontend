import { z } from "zod";

export const matchBreakdownSchema = z
  .object({
    capability: z.number().optional(),
    category: z.number().optional(),
    budget: z.number().optional(),
    location: z.number().optional(),
    keywords: z.number().optional(),
  })
  .optional();

export const rankingBreakdownSchema = z
  .object({
    reputation: z.number().optional(),
    response: z.number().optional(),
    completion: z.number().optional(),
    activity: z.number().optional(),
    verification: z.number().optional(),
    boost: z.number().optional(),
    penalty: z.number().optional(),
  })
  .optional();

// Ranking = match + reputation + response + completion + activity + verification + boost - penalty
export const matchResultSchema = z.object({
  opportunityId: z.string(),
  matchScore: z.number().min(0).max(100),
  rankingScore: z.number(),
  breakdown: matchBreakdownSchema,
  rankingBreakdown: rankingBreakdownSchema,
  counterparty: z.object({
    partyId: z.string(),
    name: z.string(),
    avatarUrl: z.string().nullable().optional(),
    verificationStatus: z.string().optional(),
  }),
});
export type MatchResult = z.infer<typeof matchResultSchema>;

