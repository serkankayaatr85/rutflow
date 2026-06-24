import { createClient } from "@/lib/supabase/server";
import type { CurrentUser, Product, ProductCategory } from "@/types";

/**
 * Oturum açmış kullanıcının profiles kaydını ve rolüne göre
 * pharmacists / representatives / companies tablosundaki detay
 * satırını getirir. Server Component, Server Action veya Route
 * Handler içinden çağrılmalıdır.
 *
 * Oturum yoksa veya profile satırı bulunamazsa null döner.
 */
export async function getCurrentUser(): Promise<CurrentUser | null> {
  const supabase = await createClient();

  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authData.user.id)
    .single();

  if (profileError || !profile) {
    return null;
  }

  let pharmacist = null;
  let representative = null;
  let company = null;

  if (profile.role === "pharmacist") {
    const { data } = await supabase
      .from("pharmacists")
      .select("*")
      .eq("profile_id", profile.id)
      .maybeSingle();
    pharmacist = data ?? null;
  }

  if (profile.role === "representative") {
    const { data } = await supabase
      .from("representatives")
      .select("*")
      .eq("profile_id", profile.id)
      .maybeSingle();
    representative = data ?? null;
  }

  if (profile.role === "company") {
    const { data } = await supabase
      .from("companies")
      .select("*")
      .eq("profile_id", profile.id)
      .maybeSingle();
    company = data ?? null;
  }

  return { profile, pharmacist, representative, company };
}

// ===========================================================================
// Ürün / Kategori / Numune sorguları
// ===========================================================================

export async function getProductCategories(): Promise<ProductCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .order("category_name", { ascending: true });

  if (error || !data) return [];
  return data;
}

export interface ProductWithSample extends Product {
  product_categories: { category_name: string } | null;
  product_samples: { sample_available: boolean; sample_notes: string | null }[];
}

/** Mümessilin kendi ürün listesi (kategori adı ve numune bilgisiyle birlikte). */
export async function getMyProducts(representativeId: string): Promise<ProductWithSample[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, product_categories(category_name), product_samples(sample_available, sample_notes)")
    .eq("representative_id", representativeId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as unknown as ProductWithSample[];
}

export interface ProductWithRepresentative extends ProductWithSample {
  representatives: { id: string; company_name: string; region: string } | null;
}

/** Eczacının görebileceği, tüm aktif ürünler (mümessil bilgisiyle birlikte). */
export async function getBrowseProducts(): Promise<ProductWithRepresentative[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "*, product_categories(category_name), representatives(id, company_name, region), product_samples(sample_available, sample_notes)"
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return data as unknown as ProductWithRepresentative[];
}

/** Bir eczacının daha önce numune talebi gönderdiği ürün id'lerinin kümesi. */
export async function getRequestedProductIds(pharmacistId: string): Promise<Set<string>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sample_requests")
    .select("product_id")
    .eq("pharmacist_id", pharmacistId);

  if (error || !data) return new Set();
  return new Set(data.map((row) => row.product_id));
}
