alter table public.campaigns rename column campaign_title to title;
alter table public.campaigns rename column campaign_description to description;

alter table public.campaigns add column if not exists representative_id uuid references public.representatives(id);
alter table public.campaigns alter column representative_id set not null;

alter table public.campaigns add column if not exists image_url text;
alter table public.campaigns alter column mf_condition set not null;
alter table public.campaigns alter column start_date set not null;
alter table public.campaigns alter column end_date set not null;

create table public.campaign_views (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  pharmacist_id uuid not null references public.pharmacists(id) on delete cascade,
  viewed_at timestamptz not null default now()
);

create table public.campaign_clicks (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  pharmacist_id uuid not null references public.pharmacists(id) on delete cascade,
  clicked_at timestamptz not null default now()
);

create table public.campaign_saves (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  pharmacist_id uuid not null references public.pharmacists(id) on delete cascade,
  saved_at timestamptz not null default now()
);
