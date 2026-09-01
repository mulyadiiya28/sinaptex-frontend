import { z } from "zod";

export const boostPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  tier: z.enum(["BASIC", "PREMIUM", "VIP"]),
  price: z.number().nonnegative(),
  durationDays: z.number().int().positive(),
});
export type BoostPlan = z.infer<typeof boostPlanSchema>;

export const activateBoostSchema = z.object({
  opportunityId: z.string().min(1),
  planId: z.string().min(1),
});
export type ActivateBoostInput = z.infer<typeof activateBoostSchema>;
