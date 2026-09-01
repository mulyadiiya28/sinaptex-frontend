import { z } from "zod";

// Deal: NEGOTIATION -> DEAL | CANCELLED | EXPIRED
// DEAL -> IN_PROGRESS | CANCELLED | EXPIRED
// IN_PROGRESS -> COMPLETED | CANCELLED
export const dealStatusSchema = z.enum([
  "NEGOTIATION",
  "DEAL",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
  "EXPIRED",
]);
export type DealStatus = z.infer<typeof dealStatusSchema>;

export const dealSchema = z.object({
  id: z.string(),
  invitationId: z.string(),
  status: dealStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Deal = z.infer<typeof dealSchema>;
