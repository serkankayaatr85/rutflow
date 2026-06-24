-- handle_new_user() trigger fonksiyonu, anon/authenticated rollerinden
-- doğrudan RPC ile çağrılabilir durumdaydı (PostgREST /rest/v1/rpc/...).
-- Trigger context dışında çalışmaz ama gereksiz yüzey alanını kapatıyoruz.
revoke execute on function public.handle_new_user() from anon, authenticated;

-- product-images bucket'ı zaten public (CDN üzerinden URL ile herkese açık),
-- bu select policy'nin anon dahil herkese açık olması storage.objects
-- tablosunu listelenebilir kılıyordu. Sadece authenticated'a indiriyoruz.
drop policy "product_images_public_read" on storage.objects;
create policy "product_images_authenticated_read" on storage.objects for select
  to authenticated
  using (bucket_id = 'product-images');
