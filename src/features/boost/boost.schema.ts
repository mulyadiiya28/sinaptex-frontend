import { z } from "zod";

export const boostPlanSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["FREE", "BASIC", "PREMIUM", "VIP"]).or(z.string()).optional(),
  tier: z.enum(["BASIC", "PREMIUM", "VIP"]).or(z.string()).optional(),
  price: z.number().nonnegative(),
  durationDays: z.number().int().positive(),
  priorityWeight: z.number().optional(),
});
export type BoostPlan = z.infer<typeof boostPlanSchema>;

export const activateBoostSchema = z.object({
  opportunityId: z.string().min(1),
  planId: z.string().min(1),
});
export type ActivateBoostInput = z.infer<typeof activateBoostSchema>;
