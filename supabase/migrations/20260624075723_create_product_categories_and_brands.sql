create table public.product_categories (
  id uuid primary key default gen_random_uuid(),
  category_name text not null,
  parent_category_id uuid references public.product_categories(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.product_brands (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  brand_name text not null,
  logo_url text,
  created_at timestamptz not null default now()
);

insert into public.product_categories (category_name) values
  ('Vitaminler'), ('Mineraller'), ('Omega 3'), ('Probiyotikler'),
  ('Dermokozmetik'), ('Bebek Bakımı'), ('Tıbbi Cihazlar'),
  ('OTC'), ('Takviye Edici Gıda');
