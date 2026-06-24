create table public.regions (
  id uuid primary key default gen_random_uuid(),
  region_name text not null
);

insert into public.regions (region_name) values
  ('İzmir Kuzey'), ('İzmir Güney'), ('Aydın'), ('Manisa'), ('Muğla');

create table public.representative_regions (
  id uuid primary key default gen_random_uuid(),
  representative_id uuid not null references public.representatives(id) on delete cascade,
  region_id uuid not null references public.regions(id) on delete cascade
);

create table public.representative_specialties (
  id uuid primary key default gen_random_uuid(),
  representative_id uuid not null references public.representatives(id) on delete cascade,
  category_id uuid not null references public.product_categories(id) on delete cascade
);

create table public.representative_documents (
  id uuid primary key default gen_random_uuid(),
  representative_id uuid not null references public.representatives(id) on delete cascade,
  file_name text not null,
  file_url text not null,
  file_type text not null,
  uploaded_at timestamptz not null default now()
);

create table public.pharmacist_favorites (
  id uuid primary key default gen_random_uuid(),
  pharmacist_id uuid not null references public.pharmacists(id) on delete cascade,
  representative_id uuid not null references public.representatives(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.pharmacy_interests (
  id uuid primary key default gen_random_uuid(),
  pharmacist_id uuid not null references public.pharmacists(id) on delete cascade,
  category_id uuid not null references public.product_categories(id) on delete cascade
);
