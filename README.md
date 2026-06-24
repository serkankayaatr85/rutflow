# RutFlow

Eczacılar, tıbbi mümessiller ve firmaları aynı akışta buluşturan profesyonel ağ platformu.

Next.js 15 (App Router) · TypeScript · Tailwind CSS · shadcn/ui · Supabase

---

## Bu fazda tamamlanan kapsam

- [x] Proje iskeleti (Next.js 15 + TS + Tailwind + shadcn/ui)
- [x] Supabase bağlantısı (browser client, server client, middleware session refresh)
- [x] Auth: Kayıt Ol, Giriş Yap, e-posta doğrulama callback
- [x] Kullanıcı tipi seçimi: **Eczacı / Tıbbi Mümessil / Firma**
- [x] Role bazlı `profiles` + detay tablosu (pharmacists / representatives / companies) otomatik oluşturma (DB trigger)
- [x] Korumalı Dashboard layout + role'e göre sidebar/menü
- [x] **Ürün modülü**: mümessil ürün ekler (kategori + opsiyonel numune bilgisi + görsel yükleme), eczacı tüm aktif ürünleri gezer ve numune talep eder
- [x] **Canlı Supabase projesi koda göre tam yeniden yapılandırıldı** (23 tablo, RLS, trigger, storage) — bkz. `supabase/migrations/`
- [x] **Admin yetkileri + denetim (audit) log altyapısı** (`is_admin()`, `admin_logs`)
- [x] **Güvenlik taraması**: `get_advisors` sıfır uyarı veriyor (RLS initplan optimizasyonu, duplicate policy temizliği, fonksiyon erişim kısıtları)
- [x] **Yedekleme altyapısı**: Free plan'da yerleşik backup olmadığı için GitHub Actions ile günlük otomatik `pg_dump`

## Sırada (henüz yapılmadı)

- Görüşme/randevu talebi (eczacı gönderir, mümessil yönetir)
- Mümessil tarafında gelen numune taleplerini onaylama/reddetme ekranı
- Takip sistemi, kampanya CRUD
- Admin paneli UI (DB altyapısı hazır: `is_admin()` + `admin_logs`, ekranlar yok)
- Auth Dashboard ayarları (aşağıdaki "Güvenlik" bölümüne bak) — bunlar koddan değil, Supabase Dashboard'dan elle yapılmalı

---

## 1) Kurulum

```bash
npm install
cp .env.local.example .env.local
```

`.env.local` içine Supabase proje bilgilerini gir (Supabase Dashboard → Project Settings → API):

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 2) Supabase — şu an gerçek proje üzerinde zaten kurulu

Bu projenin bağlı olduğu Supabase projesi (`serkankayaatr85's Project`) **doğrudan Supabase MCP üzerinden** yapılandırıldı: tüm tablolar, RLS politikaları, `handle_new_user` trigger'ı, `product-images` storage bucket'ı ve admin/audit altyapısı canlıda zaten mevcut. Aşağıdaki adımları **tekrar çalıştırmana gerek yok** — bunlar sadece referans/yedek olarak repoda tutuluyor.

`supabase/migrations/` klasöründeki dosyalar, canlı projede tam olarak hangi DDL'in hangi sırayla çalıştığının birebir kaydıdır (Supabase CLI migration formatında). Bu klasör iki işe yarar:

1. **Versiyon kontrolü**: şema değişiklikleri git'te izlenebilir.
2. **Sıfırdan kurulum / felaket kurtarma**: Supabase CLI kuruluysa, boş bir projede şemayı yeniden oluşturmak için:
   ```bash
   supabase link --project-ref <yeni-proje-ref>
   supabase db push
   ```

> Not: `companies`, `company_branches`, `company_analytics`, `product_categories`,
> `product_brands`, `regions`, `representative_regions`,
> `representative_specialties`, `representative_documents`, `campaign_views`,
> `campaign_clicks`, `campaign_saves`, `product_samples`, `pharmacist_favorites`,
> `pharmacy_interests` tabloları sonradan paylaşılan Notion şemasıyla
> doğrulandı ve `src/types/database.types.ts` içine işlendi.
>
> `products.category_id`, `product_categories` tablosuna FK olarak
> tasarlandı (önceki düz metin `category` alanının yerini aldı).
> `brand_id` eklenmedi çünkü `representatives` tablosunun `companies`
> tablosuna FK'si yok — bu eklenince `product_brands` ile düzgün
> ilişkilendirilebilir (`representatives.company_id` nullable olarak
> önceden eklendi, ileride kullanılabilir).

Supabase Dashboard → Authentication → Settings içinde **Site URL** ve
**Redirect URLs**'e `http://localhost:3000/auth/callback` (ve prod domainin
karşılığını) eklemeyi unutma; e-posta doğrulama linki buraya yönlenir.

## 3) Çalıştırma

```bash
npm run dev
```

`http://localhost:3000` üzerinden:

- `/` → karşılama ekranı
- `/register` → kullanıcı tipi seçimi + role özel kayıt formu
- `/login` → giriş
- `/dashboard` → korumalı alan (girişsiz erişimde `/login`'e yönlenir)
- `/dashboard/products` → (mümessil) kendi ürünleri
- `/dashboard/products/new` → (mümessil) yeni ürün ekleme
- `/dashboard/search` → (eczacı) tüm aktif ürünleri gezme + numune talebi

---

## 4) Güvenlik

### Veritabanı seviyesinde (zaten yapıldı)

- **RLS her tabloda açık** ve her tablonun en az bir policy'si var (önceden hiçbiri yoktu — her şey kilitliydi).
- **`is_admin()` fonksiyonu** + `profiles`/`pharmacists`/`representatives`/`companies`/`products`/`campaigns` üzerinde admin override politikaları: admin artık kullanıcı askıya alabilir, firma/temsilci onaylayabilir, kampanya/ürün kaldırabilir.
- **`admin_logs` tablosu**: admin aksiyonlarının denetim kaydı (`action_type`, `target_id`, `details` jsonb). Şu an sadece DB seviyesinde — admin panel UI'ı yazıldığında her admin aksiyonunda buraya `insert` eklenmeli.
- **`get_advisors` (security)**: 0 uyarı. Düzeltilen 2 gerçek sorun: `handle_new_user()` fonksiyonunun PUBLIC'e açık RPC erişimi kapatıldı; `product-images` bucket'ında gereksiz public listing policy'si kaldırıldı.
- **`get_advisors` (performance)**: RLS politikalarında `auth.uid()` → `(select auth.uid())` optimizasyonu yapıldı (her satır için yeniden hesaplanmasın diye), çakışan (duplicate) permissive policy'ler tek policy'ye birleştirildi, tüm FK kolonlarına index eklendi.

### Supabase Dashboard'dan elle yapılması gerekenler (kod/SQL ile yapılamaz)

Şu ayarlar Supabase Dashboard → **Authentication → Settings**'ten yapılmalı:

- [ ] **Leaked Password Protection**'ı aç (HaveIBeenPwned kontrolü) — sızıntıya uğramış şifrelerle kayıt/giriş engellenir.
- [ ] Minimum şifre uzunluğunu en az **8**'e çıkar (varsayılan 6).
- [ ] **Site URL** ve **Redirect URLs** allowlist'ini sadece kendi domain'lerinle sınırlı tut (yukarıda bahsedildi).
- [ ] Kullanmadığın auth provider'ları (varsa) devre dışı bırak.
- [ ] Üretime geçerken **Rate Limits** (Auth → Rate Limits) değerlerini trafiğine göre gözden geçir.
- [ ] `.env.local`'daki `SUPABASE_SERVICE_ROLE_KEY`'i **asla** client koduna veya git'e koyma — sadece sunucu taraflı, gizli ortam değişkeni olarak kullan.

## 5) Yedekleme

**Önemli:** Bu proje Supabase **Free plan**'da çalışıyor ve Free plan'da **hiçbir otomatik yedekleme yok** (ne günlük backup ne Point-in-Time Recovery). Şu an risk düşük çünkü tablolar boş/sadece seed verisi var, ama gerçek kullanıcı verisi girmeye başladığı an bu kritik hale gelir.

Bunun için iki katmanlı bir çözüm kuruldu:

1. **Şema yedeği (zaten yapıldı, ücretsiz)**: `supabase/migrations/` klasörü, canlı veritabanının DDL geçmişinin tam kopyası. Git'e commit edildiği sürece şema hiçbir zaman kaybolmaz.
2. **Veri yedeği (kurulum gerektirir, ücretsiz)**: `.github/workflows/db-backup.yml` — her gün otomatik `pg_dump` alıp repodaki ayrı bir `backups` branch'ine commit eden GitHub Action.

   Kurulum:
   - Supabase Dashboard → Project Settings → Database → Connection string → **Session pooler** (IPv4 uyumlu) bağlantı dizesini kopyala.
   - GitHub repo → Settings → Secrets and variables → Actions → `SUPABASE_DB_URL` adıyla ekle.
   - Workflow otomatik olarak her gün 02:00 UTC'de çalışır; `Actions` sekmesinden manuel de tetiklenebilir (`workflow_dispatch`).
   - Son 30 günlük yedek tutulur, daha eskiler otomatik silinir.

   Manuel/ani yedek için (örn. riskli bir migration'dan önce):
   ```bash
   export SUPABASE_DB_URL="postgresql://postgres.[ref]:[şifre]@aws-0-[region].pooler.supabase.com:5432/postgres"
   ./scripts/backup-db.sh
   ```

   Geri yükleme (DİKKAT: önce boş/test projede dene):
   ```bash
   ./scripts/restore-db.sh backups/rutflow-20260624-020000.sql.gz
   ```

3. **Gerçek üretime geçince**: Supabase **Pro plan**'a ($25/ay) yükselt — otomatik günlük backup (7 gün) + opsiyonel Point-in-Time Recovery add-on gelir. GitHub Actions yedeği o noktada da ek güvenlik katmanı olarak tutulabilir.

---

## Klasör yapısı

```
rutflow/
├── .github/
│   └── workflows/
│       └── db-backup.yml             # Günlük otomatik pg_dump (Free plan'da yerleşik backup yok)
├── scripts/
│   ├── backup-db.sh                  # Manuel/ani yedek alma
│   └── restore-db.sh                 # Yedekten geri yükleme (dikkatli kullan)
├── supabase/
│   └── migrations/                   # Canlı DB'de çalışan DDL'in birebir kaydı (23 dosya)
│       ├── 20260624075639_restructure_profiles.sql
│       ├── 20260624075650_restructure_pharmacists.sql
│       ├── ...
│       └── 20260624085826_admin_role_and_audit_log.sql
├── src/
│   ├── middleware.ts                 # Supabase session refresh + route guard
│   ├── app/
│   │   ├── layout.tsx                # Root layout, font, metadata
│   │   ├── page.tsx                  # Splash / landing
│   │   ├── globals.css               # Tailwind + shadcn tema değişkenleri
│   │   ├── (auth)/
│   │   │   ├── layout.tsx
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── auth/callback/route.ts    # E-posta doğrulama redirect handler
│   │   └── (dashboard)/
│   │       ├── layout.tsx            # Auth guard + Sidebar/Header
│   │       └── dashboard/
│   │           ├── page.tsx          # Role bazlı özet ekranı
│   │           ├── products/
│   │           │   ├── page.tsx      # (mümessil) Ürünlerim
│   │           │   └── new/page.tsx  # (mümessil) Yeni Ürün
│   │           └── search/page.tsx   # (eczacı) Ürün/Mümessil Ara
│   ├── components/
│   │   ├── ui/                       # shadcn/ui primitifleri
│   │   ├── auth/
│   │   │   ├── user-type-selector.tsx
│   │   │   ├── login-form.tsx
│   │   │   └── register-form.tsx
│   │   ├── products/
│   │   │   ├── product-form.tsx
│   │   │   ├── product-card.tsx
│   │   │   └── request-sample-button.tsx
│   │   └── dashboard/
│   │       ├── sidebar.tsx
│   │       ├── header.tsx
│   │       └── nav-config.ts
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser client
│   │   │   ├── server.ts             # Server Component / Action client
│   │   │   ├── middleware.ts         # updateSession()
│   │   │   └── queries.ts            # getCurrentUser(), ürün sorguları
│   │   ├── actions/
│   │   │   └── products.ts           # createProductAction, requestSampleAction
│   │   ├── validations/
│   │   │   ├── auth.ts               # zod şemaları (login, register)
│   │   │   └── product.ts            # zod şeması (ürün formu)
│   │   └── utils.ts                  # cn()
│   └── types/
│       ├── database.types.ts         # Supabase tabloları
│       └── index.ts                  # Profile/Pharmacist/Representative/Company/Product... tipleri
```
