import { z } from "zod";

// Auth aktual (email/password) ditangani Supabase di client.
// Schema ini untuk sinkronisasi profil ke backend engine setelah Supabase auth sukses.

export const registerProfileSchema = z.object({
  fullName: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(8, "Nomor telepon tidak valid").optional(),
});
export type RegisterProfileInput = z.infer<typeof registerProfileSchema>;

export const meResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  fullName: z.string(),
  isVerified: z.boolean().default(false),
});
export type Me = z.infer<typeof meResponseSchema>;
