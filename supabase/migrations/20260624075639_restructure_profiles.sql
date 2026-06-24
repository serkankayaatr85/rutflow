-- user_type -> role (yeni check constraint: pharmacist/representative/company/admin)
alter table public.profiles drop constraint if exists profiles_user_type_check;
alter table public.profiles rename column user_type to role;
alter table public.profiles add constraint profiles_role_check
  check (role = any (array['pharmacist','representative','company','admin']));

-- phone -> phone_number, profile_image -> avatar_url
alter table public.profiles rename column phone to phone_number;
alter table public.profiles rename column profile_image to avatar_url;

-- city/district eczacı detayına taşınıyor (pharmacists tablosunda olacak)
alter table public.profiles drop column if exists city;
alter table public.profiles drop column if exists district;

-- eksik alanlar
alter table public.profiles add column if not exists is_active boolean not null default true;
alter table public.profiles add column if not exists updated_at timestamptz not null default now();
