"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/supabase/queries";
import { productSchema, type ProductInput } from "@/lib/validations/product";

export interface ActionResult {
  success: boolean;
  message?: string;
}

/**
 * Mümessil ürün oluşturur. Aynı işlemde `sampleAvailable` true ise
 * product_samples tablosuna da bir satır açar.
 */
export async function createProductAction(input: ProductInput): Promise<ActionResult> {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Geçersiz form verisi" };
  }

  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.profile.role !== "representative" || !currentUser.representative) {
    return { success: false, message: "Bu işlem için mümessil hesabıyla giriş yapmalısın." };
  }

  const supabase = await createClient();
  const data = parsed.data;

  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      representative_id: currentUser.representative.id,
      name: data.name,
      category_id: data.categoryId,
      description: data.description || null,
      image_url: data.imageUrl || null,
    })
    .select("id")
    .single();

  if (productError || !product) {
    return { success: false, message: "Ürün oluşturulamadı. Lütfen tekrar dene." };
  }

  if (data.sampleAvailable) {
    const { error: sampleError } = await supabase.from("product_samples").insert({
      product_id: product.id,
      representative_id: currentUser.representative.id,
      sample_available: true,
      sample_notes: data.sampleNotes || null,
    });

    if (sampleError) {
      // Ürün oluşturuldu ama numune kaydı başarısız oldu — kullanıcıyı bilgilendir,
      // ürünü geri almıyoruz çünkü ürünün kendisi geçerli.
      return {
        success: true,
        message: "Ürün oluşturuldu fakat numune bilgisi kaydedilemedi, ürünü düzenleyerek tekrar deneyebilirsin.",
      };
    }
  }

  revalidatePath("/dashboard/products");
  return { success: true };
}

/** Eczacı bir ürün için numune talebi oluşturur. */
export async function requestSampleAction(productId: string, representativeId: string): Promise<ActionResult> {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.profile.role !== "pharmacist" || !currentUser.pharmacist) {
    return { success: false, message: "Bu işlem için eczacı hesabıyla giriş yapmalısın." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("sample_requests").insert({
    pharmacist_id: currentUser.pharmacist.id,
    representative_id: representativeId,
    product_id: productId,
    status: "pending",
  });

  if (error) {
    return { success: false, message: "Numune talebi gönderilemedi. Lütfen tekrar dene." };
  }

  revalidatePath("/dashboard/search");
  return { success: true };
}
