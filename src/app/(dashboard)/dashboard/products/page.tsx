import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, PackageSearch } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { getCurrentUser, getMyProducts } from "@/lib/supabase/queries";

export default async function MyProductsPage() {
  const currentUser = await getCurrentUser();
  if (!currentUser) redirect("/login");

  if (currentUser.profile.role !== "representative" || !currentUser.representative) {
    redirect("/dashboard");
  }

  const products = await getMyProducts(currentUser.representative.id);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Ürünlerim</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Eczacıların görebileceği ürünlerini buradan yönet.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/products/new">
            <Plus className="h-4 w-4" />
            Yeni Ürün
          </Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border py-16 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-primary">
            <PackageSearch className="h-6 w-6" />
          </span>
          <p className="text-sm font-medium text-foreground">Henüz ürün eklemedin</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            İlk ürününü ekleyerek eczacıların seni ve ürünlerini görmesini sağla.
          </p>
          <Button asChild size="sm" className="mt-2">
            <Link href="/dashboard/products/new">Ürün Ekle</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} variant="owner" product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
