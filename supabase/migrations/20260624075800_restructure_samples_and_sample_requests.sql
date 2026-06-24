-- sample_requests'i eski samples tablosundan ayır
alter table public.sample_requests drop constraint if exists sample_requests_sample_id_fkey;
alter table public.sample_requests drop column if exists sample_id;
alter table public.sample_requests drop column if exists note;

alter table public.sample_requests add column if not exists representative_id uuid references public.representatives(id);
alter table public.sample_requests add column if not exists product_id uuid references public.products(id);
alter table public.sample_requests alter column representative_id set not null;
alter table public.sample_requests alter column product_id set not null;

alter table public.sample_requests drop constraint if exists sample_requests_status_check;
alter table public.sample_requests add constraint sample_requests_status_check
  check (status = any (array['pending','accepted','rejected','completed']));

-- eski katalog tarzı samples tablosunu kaldır, yerine ürün bazlı numune flag'i ekle
drop table public.samples;

create table public.product_samples (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  representative_id uuid not null references public.representatives(id) on delete cascade,
  sample_available boolean not null default false,
  sample_notes text
);
