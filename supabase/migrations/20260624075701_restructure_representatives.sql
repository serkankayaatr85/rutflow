alter table public.representatives drop constraint if exists representatives_id_fkey;
alter table public.representatives alter column id set default gen_random_uuid();

alter table public.representatives add column if not exists profile_id uuid;
alter table public.representatives add constraint representatives_profile_id_fkey
  foreign key (profile_id) references public.profiles(id) on delete cascade;
alter table public.representatives alter column profile_id set not null;
create unique index if not exists representatives_profile_id_key on public.representatives(profile_id);

-- Growth Strategy'de kritik olan bölge alanı
alter table public.representatives add column if not exists region text not null default '';
alter table public.representatives alter column region drop default;

alter table public.representatives add column if not exists followers_count integer not null default 0;
alter table public.representatives add column if not exists average_rating numeric;

-- ileride product_brands'i firmaya doğru bağlamak için (opsiyonel, nullable)
alter table public.representatives add column if not exists company_id uuid;
