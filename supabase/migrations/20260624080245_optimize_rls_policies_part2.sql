-- product_brands: aynı çakışma
drop policy "product_brands_manage_own" on public.product_brands;
create policy "product_brands_insert_own" on public.product_brands for insert to authenticated
  with check (company_id in (select id from public.companies where profile_id = (select auth.uid())));
create policy "product_brands_update_own" on public.product_brands for update to authenticated
  using (company_id in (select id from public.companies where profile_id = (select auth.uid())));
create policy "product_brands_delete_own" on public.product_brands for delete to authenticated
  using (company_id in (select id from public.companies where profile_id = (select auth.uid())));

-- products
drop policy "products_select_active_or_own" on public.products;
drop policy "products_insert_own" on public.products;
drop policy "products_update_own" on public.products;
drop policy "products_delete_own" on public.products;
create policy "products_select_active_or_own" on public.products for select to authenticated
  using (is_active = true or representative_id in (select id from public.representatives where profile_id = (select auth.uid())));
create policy "products_insert_own" on public.products for insert to authenticated
  with check (representative_id in (select id from public.representatives where profile_id = (select auth.uid())));
create policy "products_update_own" on public.products for update to authenticated
  using (representative_id in (select id from public.representatives where profile_id = (select auth.uid())));
create policy "products_delete_own" on public.products for delete to authenticated
  using (representative_id in (select id from public.representatives where profile_id = (select auth.uid())));

-- campaigns
drop policy "campaigns_select_active_or_own" on public.campaigns;
drop policy "campaigns_insert_own" on public.campaigns;
drop policy "campaigns_update_own" on public.campaigns;
drop policy "campaigns_delete_own" on public.campaigns;
create policy "campaigns_select_active_or_own" on public.campaigns for select to authenticated
  using (is_active = true or representative_id in (select id from public.representatives where profile_id = (select auth.uid())));
create policy "campaigns_insert_own" on public.campaigns for insert to authenticated
  with check (representative_id in (select id from public.representatives where profile_id = (select auth.uid())));
create policy "campaigns_update_own" on public.campaigns for update to authenticated
  using (representative_id in (select id from public.representatives where profile_id = (select auth.uid())));
create policy "campaigns_delete_own" on public.campaigns for delete to authenticated
  using (representative_id in (select id from public.representatives where profile_id = (select auth.uid())));
