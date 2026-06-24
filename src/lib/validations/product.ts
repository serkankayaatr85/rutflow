import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Ürün adı en az 2 karakter olmalı"),
  categoryId: z.string().uuid("Kategori seçimi zorunludur"),
  description: z.string().max(1000, "Açıklama en fazla 1000 karakter olmalı").optional().or(z.literal("")),
  imageUrl: z.string().url("Geçerli bir görsel URL'si olmalı").optional().or(z.literal("")),
  sampleAvailable: z.boolean(),
  sampleNotes: z.string().max(300, "Numune notu en fazla 300 karakter olmalı").optional().or(z.literal("")),
});

export type ProductInput = z.infer<typeof productSchema>;
