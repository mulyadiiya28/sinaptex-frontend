import { z } from "zod";

export const partySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["INDIVIDUAL", "COMPANY"]),
});
export type Party = z.infer<typeof partySchema>;

export const profileSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  isVerified: z.boolean(),
  parties: z.array(partySchema).default([]),
});
export type Profile = z.infer<typeof profileSchema>;

export const updateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  phone: z.string().min(8).optional(),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
