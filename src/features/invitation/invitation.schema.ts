import { z } from "zod";

// State machine sesuai README engine bagian 8:
// Invitation: PENDING -> ACCEPTED | REJECTED | EXPIRED ; ACCEPTED -> Deal(NEGOTIATION)
export const invitationStatusSchema = z.enum(["PENDING", "ACCEPTED", "REJECTED", "EXPIRED"]);
export type InvitationStatus = z.infer<typeof invitationStatusSchema>;

export const createInvitationSchema = z.object({
  opportunityId: z.string().min(1),
  targetOpportunityId: z.string().min(1),
  message: z.string().max(500).optional(),
});
export type CreateInvitationInput = z.infer<typeof createInvitationSchema>;

export const invitationSchema = z.object({
  id: z.string(),
  status: invitationStatusSchema,
  opportunityId: z.string(),
  targetOpportunityId: z.string(),
  message: z.string().nullable().optional(),
  createdAt: z.string(),
});
export type Invitation = z.infer<typeof invitationSchema>;
