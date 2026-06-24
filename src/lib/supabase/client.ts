import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

/**
 * Client Component'lerde kullanılacak Supabase client'ı.
 * Her çağrıldığında yeni bir instance döner; @supabase/ssr
 * bunu tarayıcıda otomatik olarak singleton gibi yönetir.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
