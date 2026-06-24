import { redirect } from "next/navigation";

import { ProductForm } from "@/components/products/product-form";
import { getCurrentUser, getProductCategories } from "@/lib/supabase/queries";

export default async function NewProductPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  if (currentUser.profile.role !== "representative" || !currentUser.representative) {
    redirect("/dashboard");
  }

  const categories = await getProductCategories();

  return (
    <div className="mx-auto max-w-lg">
      <ProductForm categories={categories} representativeId={currentUser.representative.id} />
    </div>
  );
}
