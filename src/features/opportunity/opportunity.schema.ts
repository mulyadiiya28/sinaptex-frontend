import { z } from "zod";

// Sesuai README engine bagian 3 "Opportunity (Need / Offer)"

export const opportunityTypeSchema = z.enum(["NEED", "OFFER"]);
export type OpportunityType = z.infer<typeof opportunityTypeSchema>;

export const opportunityStatusSchema = z.enum(["ACTIVE", "CLOSED", "EXPIRED", "CANCELLED"]);
export type OpportunityStatus = z.infer<typeof opportunityStatusSchema>;

export const createOpportunitySchema = z.object({
  type: opportunityTypeSchema,
  title: z.string().min(5, "Judul minimal 5 karakter").max(120),
  description: z.string().min(20, "Deskripsi minimal 20 karakter"),
  categoryId: z.string().min(1, "Kategori wajib dipilih"),
  budgetMin: z.number().nonnegative().optional(),
  budgetMax: z.number().nonnegative().optional(),
  location: z.string().optional(),
  tags: z.array(z.string()).max(10).optional(),
});
export type CreateOpportunityInput = z.infer<typeof createOpportunitySchema>;

export const opportunitySchema = z.object({
  id: z.string(),
  type: opportunityTypeSchema,
  status: opportunityStatusSchema,
  title: z.string(),
  description: z.string(),
  categoryId: z.string(),
  budgetMin: z.number().nullable().optional(),
  budgetMax: z.number().nullable().optional(),
  location: z.string().nullable().optional(),
  tags: z.array(z.string()).default([]),
  createdAt: z.string(),
});
export type Opportunity = z.infer<typeof opportunitySchema>;

// Kode error quota dari engine — dipetakan ke pesan UI yang jelas.
// Non-member: maks 1 ACTIVE Need + 1 ACTIVE Offer.
// Member aktif: maks 20 ACTIVE Need + 20 ACTIVE Offer.
export const OPPORTUNITY_QUOTA_EXCEEDED = "OPPORTUNITY_QUOTA_EXCEEDED";
