create table public.companies (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  company_name text not null,
  logo_url text,
  website_url text,
  contact_email text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);
create unique index companies_profile_id_key on public.companies(profile_id);

create table public.company_branches (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  branch_name text not null,
  city text not null,
  created_at timestamptz not null default now()
);

create table public.company_analytics (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  month date not null,
  total_campaign_views integer not null default 0,
  total_campaign_clicks integer not null default 0,
  total_interactions integer not null default 0,
  total_followers integer not null default 0
);

-- representatives.company_id artık companies'e bağlanabilir
alter table public.representatives add constraint representatives_company_id_fkey
  foreign key (company_id) references public.companies(id) on delete set null;
