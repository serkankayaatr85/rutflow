-- PostgreSQL yeni fonksiyonlara varsayılan olarak PUBLIC'e EXECUTE verir;
-- anon/authenticated'dan revoke etmek PUBLIC grant'i geçersiz kılmıyordu.
revoke execute on function public.handle_new_user() from public;

-- product-images zaten public=true bir bucket: objeler /storage/v1/object/public/...
-- üzerinden RLS'e bakılmaksızın servis ediliyor. Uygulamamızda dosya
-- listeleme (storage.objects üzerinde SELECT) ihtiyacı yok, policy'yi kaldırıyoruz.
drop policy if exists "product_images_authenticated_read" on storage.objects;
