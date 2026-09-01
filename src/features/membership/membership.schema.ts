import { z } from "zod";

export const membershipPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  billingCycle: z.enum(["MONTHLY", "YEARLY"]),
  price: z.number().nonnegative(),
});
export type MembershipPlan = z.infer<typeof membershipPlanSchema>;

export const membershipStatusSchema = z.object({
  isActive: z.boolean(),
  expiresAt: z.string().nullable(),
  planId: z.string().nullable(),
});
export type MembershipStatus = z.infer<typeof membershipStatusSchema>;
