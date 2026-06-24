import { redirect } from "next/navigation";
import { SearchX } from "lucide-react";

import { ProductCard } from "@/components/products/product-card";
import { getBrowseProducts, getCurrentUser, getRequestedProductIds } from "@/lib/supabase/queries";

export default async function SearchPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  if (currentUser.profile.role !== "pharmacist" || !currentUser.pharmacist) {
    redirect("/dashboard");
  }

  const [products, requestedIds] = await Promise.all([
    getBrowseProducts(),
    getRequestedProductIds(currentUser.pharmacist.id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Ürün / Mümessil Ara</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tüm aktif ürünleri ve mümessilleri buradan keşfedebilirsin.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
            <SearchX className="h-6 w-6" />
          </span>
          <p className="text-sm font-medium text-foreground">Henüz yayınlanmış ürün yok</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Mümessiller ürün ekledikçe burada görünecekler.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              variant="browse"
              product={product}
              alreadyRequested={requestedIds.has(product.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
