-- is_admin(): RLS politikalarında kullanılacak yardımcı fonksiyon.
create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1 from public.profiles where id = (select auth.uid()) and role = 'admin'
  );
$$;

drop policy "profiles_update_own" on public.profiles;
create policy "profiles_update_own_or_admin" on public.profiles for update to authenticated
  using ((select auth.uid()) = id or public.is_admin());

create policy "profiles_delete_admin" on public.profiles for delete to authenticated
  using (public.is_admin());

drop policy "pharmacists_select_own" on public.pharmacists;
create policy "pharmacists_select_own_or_admin" on public.pharmacists for select to authenticated
  using ((select auth.uid()) = profile_id or public.is_admin());

drop policy "representatives_update_own" on public.representatives;
create policy "representatives_update_own_or_admin" on public.representatives for update to authenticated
  using ((select auth.uid()) = profile_id or public.is_admin());

drop policy "companies_update_own" on public.companies;
create policy "companies_update_own_or_admin" on public.companies for update to authenticated
  using ((select auth.uid()) = profile_id or public.is_admin());

drop policy "products_update_own" on public.products;
drop policy "products_delete_own" on public.products;
create policy "products_update_own_or_admin" on public.products for update to authenticated
  using (representative_id in (select id from public.representatives where profile_id = (select auth.uid())) or public.is_admin());
create policy "products_delete_own_or_admin" on public.products for delete to authenticated
  using (representative_id in (select id from public.representatives where profile_id = (select auth.uid())) or public.is_admin());

drop policy "campaigns_update_own" on public.campaigns;
drop policy "campaigns_delete_own" on public.campaigns;
create policy "campaigns_update_own_or_admin" on public.campaigns for update to authenticated
  using (representative_id in (select id from public.representatives where profile_id = (select auth.uid())) or public.is_admin());
create policy "campaigns_delete_own_or_admin" on public.campaigns for delete to authenticated
  using (representative_id in (select id from public.representatives where profile_id = (select auth.uid())) or public.is_admin());

-- admin_logs: Notion şemasındaki audit-trail tablosu
create table public.admin_logs (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid not null references public.profiles(id),
  action_type text not null,
  target_id uuid,
  details jsonb,
  created_at timestamptz not null default now()
);
alter table public.admin_logs enable row level security;
create policy "admin_logs_select_admin" on public.admin_logs for select to authenticated
  using (public.is_admin());
create policy "admin_logs_insert_admin" on public.admin_logs for insert to authenticated
  with check (public.is_admin() and admin_id = (select auth.uid()));

create index idx_admin_logs_admin_id on public.admin_logs(admin_id);
create index idx_admin_logs_target_id on public.admin_logs(target_id);
