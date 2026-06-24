"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { createProductAction } from "@/lib/actions/products";
import { productSchema, type ProductInput } from "@/lib/validations/product";
import type { ProductCategory } from "@/types";

interface ProductFormProps {
  categories: ProductCategory[];
  representativeId: string;
}

export function ProductForm({ categories, representativeId }: ProductFormProps) {
  const router = useRouter();
  const supabase = createClient();
  const [formError, setFormError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      categoryId: "",
      description: "",
      imageUrl: "",
      sampleAvailable: false,
      sampleNotes: "",
    },
  });

  const sampleAvailable = watch("sampleAvailable");
  const imageUrl = watch("imageUrl");

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setFormError(null);

    const filePath = `${representativeId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("product-images").upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      setFormError("Görsel yüklenemedi. Lütfen tekrar dene.");
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
    setValue("imageUrl", publicUrlData.publicUrl, { shouldValidate: true });
    setUploading(false);
  }

  async function onSubmit(values: ProductInput) {
    setFormError(null);
    const result = await createProductAction(values);

    if (!result.success) {
      setFormError(result.message ?? "Ürün oluşturulamadı.");
      return;
    }

    router.push("/dashboard/products");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Yeni Ürün</CardTitle>
        <CardDescription>Eczacıların görebileceği bir ürün ekle</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Ürün Adı</Label>
            <Input id="name" placeholder="Magnezyum Plus" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Kategori</Label>
            <Controller
              control={control}
              name="categoryId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategori seç" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.category_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.categoryId && <p className="text-sm text-destructive">{errors.categoryId.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Açıklama</Label>
            <Textarea id="description" rows={3} {...register("description")} />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Ürün Görseli</Label>
            <Input id="image" type="file" accept="image/png,image/jpeg,image/webp" onChange={handleImageUpload} />
            {uploading && (
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" /> Yükleniyor...
              </p>
            )}
            {imageUrl && !uploading && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imageUrl} alt="Ürün görseli önizleme" className="h-20 w-20 rounded-md border object-cover" />
            )}
          </div>

          <div className="flex items-start gap-3 rounded-md border border-border p-3">
            <Controller
              control={control}
              name="sampleAvailable"
              render={({ field }) => (
                <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(Boolean(checked))} />
              )}
            />
            <div className="flex-1">
              <Label className="font-medium">Numune Mevcut</Label>
              <p className="text-xs text-muted-foreground">
                İşaretlersen eczacılar bu ürün için numune talebi gönderebilir.
              </p>
              {sampleAvailable && (
                <Textarea
                  className="mt-2"
                  rows={2}
                  placeholder="Numune notu (opsiyonel) — örn. stok adedi, koşullar"
                  {...register("sampleNotes")}
                />
              )}
            </div>
          </div>

          {formError && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{formError}</p>
          )}

          <Button type="submit" className="w-full" disabled={isSubmitting || uploading}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Ürünü Yayınla
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
