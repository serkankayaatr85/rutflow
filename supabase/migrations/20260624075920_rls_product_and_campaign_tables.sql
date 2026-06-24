alter table public.product_categories enable row level security;
alter table public.product_brands enable row level security;
alter table public.campaign_views enable row level security;
alter table public.campaign_clicks enable row level security;
alter table public.campaign_saves enable row level security;
alter table public.product_samples enable row level security;

create policy "product_categories_select_authenticated" on public.product_categories for select to authenticated using (true);

create policy "product_brands_select_authenticated" on public.product_brands for select to authenticated using (true);
create policy "product_brands_manage_own" on public.product_brands for all to authenticated
  using (company_id in (select id from public.companies where profile_id = auth.uid()))
  with check (company_id in (select id from public.companies where profile_id = auth.uid()));

create policy "products_select_active_or_own" on public.products for select to authenticated
  using (is_active = true or representative_id in (select id from public.representatives where profile_id = auth.uid()));
create policy "products_insert_own" on public.products for insert to authenticated
  with check (representative_id in (select id from public.representatives where profile_id = auth.uid()));
create policy "products_update_own" on public.products for update to authenticated
  using (representative_id in (select id from public.representatives where profile_id = auth.uid()));
create policy "products_delete_own" on public.products for delete to authenticated
  using (representative_id in (select id from public.representatives where profile_id = auth.uid()));

create policy "campaigns_select_active_or_own" on public.campaigns for select to authenticated
  using (is_active = true or representative_id in (select id from public.representatives where profile_id = auth.uid()));
create policy "campaigns_insert_own" on public.campaigns for insert to authenticated
  with check (representative_id in (select id from public.representatives where profile_id = auth.uid()));
create policy "campaigns_update_own" on public.campaigns for update to authenticated
  using (representative_id in (select id from public.representatives where profile_id = auth.uid()));
create policy "campaigns_delete_own" on public.campaigns for delete to authenticated
  using (representative_id in (select id from public.representatives where profile_id = auth.uid()));

create policy "campaign_views_insert_own" on public.campaign_views for insert to authenticated
  with check (pharmacist_id in (select id from public.pharmacists where profile_id = auth.uid()));
create policy "campaign_views_select_related" on public.campaign_views for select to authenticated
  using (
    pharmacist_id in (select id from public.pharmacists where profile_id = auth.uid())
    or campaign_id in (select id from public.campaigns where representative_id in (select id from public.representatives where profile_id = auth.uid()))
  );

create policy "campaign_clicks_insert_own" on public.campaign_clicks for insert to authenticated
  with check (pharmacist_id in (select id from public.pharmacists where profile_id = auth.uid()));
create policy "campaign_clicks_select_related" on public.campaign_clicks for select to authenticated
  using (
    pharmacist_id in (select id from public.pharmacists where profile_id = auth.uid())
    or campaign_id in (select id from public.campaigns where representative_id in (select id from public.representatives where profile_id = auth.uid()))
  );

create policy "campaign_saves_insert_own" on public.campaign_saves for insert to authenticated
  with check (pharmacist_id in (select id from public.pharmacists where profile_id = auth.uid()));
create policy "campaign_saves_select_own" on public.campaign_saves for select to authenticated
  using (pharmacist_id in (select id from public.pharmacists where profile_id = auth.uid()));
create policy "campaign_saves_delete_own" on public.campaign_saves for delete to authenticated
  using (pharmacist_id in (select id from public.pharmacists where profile_id = auth.uid()));

create policy "product_samples_select_authenticated" on public.product_samples for select to authenticated using (true);
create policy "product_samples_insert_own" on public.product_samples for insert to authenticated
  with check (representative_id in (select id from public.representatives where profile_id = auth.uid()));
create policy "product_samples_update_own" on public.product_samples for update to authenticated
  using (representative_id in (select id from public.representatives where profile_id = auth.uid()));

create policy "sample_requests_select_related" on public.sample_requests for select to authenticated
  using (
    pharmacist_id in (select id from public.pharmacists where profile_id = auth.uid())
    or representative_id in (select id from public.representatives where profile_id = auth.uid())
  );
create policy "sample_requests_insert_own" on public.sample_requests for insert to authenticated
  with check (pharmacist_id in (select id from public.pharmacists where profile_id = auth.uid()));
create policy "sample_requests_update_representative" on public.sample_requests for update to authenticated
  using (representative_id in (select id from public.representatives where profile_id = auth.uid()));
