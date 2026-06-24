import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

/**
 * Server Component / Server Action / Route Handler içinde kullanılacak
 * Supabase client'ı. Auth oturumunu cookie üzerinden okur ve yazar.
 *
 * Not: Server Component içinden cookie SET edilemez (Next.js kısıtı).
 * Bu yüzden `set`/`remove` çağrıları try/catch ile sarılıdır; gerçek
 * cookie yazımı middleware tarafından yapılır.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options as CookieOptions);
            });
          } catch {
            // Server Component içinden çağrıldıysa sessizce yoksay.
            // Oturum yenileme middleware tarafından zaten ele alınıyor.
          }
        },
      },
    }
  );
}
