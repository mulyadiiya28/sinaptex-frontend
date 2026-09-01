import { z } from "zod";

// FR-02: verifikasi dokumen legal bisnis — Admin APPROVE/REJECT
export const verificationStatusSchema = z.enum(["PENDING", "APPROVED", "REJECTED"]);
export type VerificationStatus = z.infer<typeof verificationStatusSchema>;

export const submitVerificationSchema = z.object({
  documentType: z.string().min(1, "Jenis dokumen wajib diisi"),
  documentUrl: z.string().url("URL dokumen tidak valid"),
  notes: z.string().max(500).optional(),
});
export type SubmitVerificationInput = z.infer<typeof submitVerificationSchema>;

export const verificationSchema = z.object({
  id: z.string(),
  status: verificationStatusSchema,
  documentType: z.string(),
  documentUrl: z.string(),
  rejectionReason: z.string().nullable().optional(),
  createdAt: z.string(),
});
export type Verification = z.infer<typeof verificationSchema>;
