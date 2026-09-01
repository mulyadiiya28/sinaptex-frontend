import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY belum di-set di .env.local"
  );
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");

/**
 * Ambil access token Supabase yang sedang aktif.
 * Dipakai api-client untuk header `Authorization: Bearer <token>`
 * sesuai cara auth backend engine (lihat README engine bagian "Autentikasi").
 */
export async function getAccessToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
