alter table public.companies enable row level security;
alter table public.company_branches enable row level security;
alter table public.company_analytics enable row level security;

create policy "profiles_select_authenticated" on public.profiles for select to authenticated using (true);
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id);

create policy "pharmacists_select_own" on public.pharmacists for select to authenticated using (auth.uid() = profile_id);
create policy "pharmacists_update_own" on public.pharmacists for update to authenticated using (auth.uid() = profile_id);

create policy "representatives_select_authenticated" on public.representatives for select to authenticated using (true);
create policy "representatives_update_own" on public.representatives for update to authenticated using (auth.uid() = profile_id);

create policy "companies_select_authenticated" on public.companies for select to authenticated using (true);
create policy "companies_update_own" on public.companies for update to authenticated using (auth.uid() = profile_id);

create policy "company_branches_select_authenticated" on public.company_branches for select to authenticated using (true);
create policy "company_branches_manage_own" on public.company_branches for all to authenticated
  using (company_id in (select id from public.companies where profile_id = auth.uid()))
  with check (company_id in (select id from public.companies where profile_id = auth.uid()));

create policy "company_analytics_select_own" on public.company_analytics for select to authenticated
  using (company_id in (select id from public.companies where profile_id = auth.uid()));
