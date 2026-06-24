-- profiles
drop policy "profiles_select_authenticated" on public.profiles;
drop policy "profiles_update_own" on public.profiles;
create policy "profiles_select_authenticated" on public.profiles for select to authenticated using (true);
create policy "profiles_update_own" on public.profiles for update to authenticated using ((select auth.uid()) = id);

-- pharmacists
drop policy "pharmacists_select_own" on public.pharmacists;
drop policy "pharmacists_update_own" on public.pharmacists;
create policy "pharmacists_select_own" on public.pharmacists for select to authenticated using ((select auth.uid()) = profile_id);
create policy "pharmacists_update_own" on public.pharmacists for update to authenticated using ((select auth.uid()) = profile_id);

-- representatives
drop policy "representatives_update_own" on public.representatives;
create policy "representatives_update_own" on public.representatives for update to authenticated using ((select auth.uid()) = profile_id);

-- companies
drop policy "companies_update_own" on public.companies;
create policy "companies_update_own" on public.companies for update to authenticated using ((select auth.uid()) = profile_id);

-- company_branches: "manage_own" select ile çakışıyordu, yazma izinlerini ayırıyoruz
drop policy "company_branches_manage_own" on public.company_branches;
create policy "company_branches_insert_own" on public.company_branches for insert to authenticated
  with check (company_id in (select id from public.companies where profile_id = (select auth.uid())));
create policy "company_branches_update_own" on public.company_branches for update to authenticated
  using (company_id in (select id from public.companies where profile_id = (select auth.uid())));
create policy "company_branches_delete_own" on public.company_branches for delete to authenticated
  using (company_id in (select id from public.companies where profile_id = (select auth.uid())));

-- company_analytics
drop policy "company_analytics_select_own" on public.company_analytics;
create policy "company_analytics_select_own" on public.company_analytics for select to authenticated
  using (company_id in (select id from public.companies where profile_id = (select auth.uid())));
