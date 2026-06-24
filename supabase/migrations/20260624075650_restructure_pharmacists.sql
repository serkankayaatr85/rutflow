-- id artık ayrı bir PK; profile_id ayrı bir FK kolonu olacak (1:1 ama ayrı kolon)
alter table public.pharmacists drop constraint if exists pharmacists_id_fkey;
alter table public.pharmacists alter column id set default gen_random_uuid();

alter table public.pharmacists add column if not exists profile_id uuid;
alter table public.pharmacists add constraint pharmacists_profile_id_fkey
  foreign key (profile_id) references public.profiles(id) on delete cascade;
alter table public.pharmacists alter column profile_id set not null;
create unique index if not exists pharmacists_profile_id_key on public.pharmacists(profile_id);

-- PRD'de zorunlu olan alanlar
alter table public.pharmacists add column if not exists gln_code text not null default '';
alter table public.pharmacists add column if not exists license_number text not null default '';
alter table public.pharmacists alter column gln_code drop default;
alter table public.pharmacists alter column license_number drop default;

alter table public.pharmacists add column if not exists city text not null default '';
alter table public.pharmacists alter column city drop default;
alter table public.pharmacists add column if not exists district text;
