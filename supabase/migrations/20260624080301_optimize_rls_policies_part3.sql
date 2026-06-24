-- campaign_views / clicks / saves
drop policy "campaign_views_insert_own" on public.campaign_views;
drop policy "campaign_views_select_related" on public.campaign_views;
create policy "campaign_views_insert_own" on public.campaign_views for insert to authenticated
  with check (pharmacist_id in (select id from public.pharmacists where profile_id = (select auth.uid())));
create policy "campaign_views_select_related" on public.campaign_views for select to authenticated
  using (
    pharmacist_id in (select id from public.pharmacists where profile_id = (select auth.uid()))
    or campaign_id in (select id from public.campaigns where representative_id in (select id from public.representatives where profile_id = (select auth.uid())))
  );

drop policy "campaign_clicks_insert_own" on public.campaign_clicks;
drop policy "campaign_clicks_select_related" on public.campaign_clicks;
create policy "campaign_clicks_insert_own" on public.campaign_clicks for insert to authenticated
  with check (pharmacist_id in (select id from public.pharmacists where profile_id = (select auth.uid())));
create policy "campaign_clicks_select_related" on public.campaign_clicks for select to authenticated
  using (
    pharmacist_id in (select id from public.pharmacists where profile_id = (select auth.uid()))
    or campaign_id in (select id from public.campaigns where representative_id in (select id from public.representatives where profile_id = (select auth.uid())))
  );

drop policy "campaign_saves_insert_own" on public.campaign_saves;
drop policy "campaign_saves_select_own" on public.campaign_saves;
drop policy "campaign_saves_delete_own" on public.campaign_saves;
create policy "campaign_saves_insert_own" on public.campaign_saves for insert to authenticated
  with check (pharmacist_id in (select id from public.pharmacists where profile_id = (select auth.uid())));
create policy "campaign_saves_select_own" on public.campaign_saves for select to authenticated
  using (pharmacist_id in (select id from public.pharmacists where profile_id = (select auth.uid())));
create policy "campaign_saves_delete_own" on public.campaign_saves for delete to authenticated
  using (pharmacist_id in (select id from public.pharmacists where profile_id = (select auth.uid())));

-- product_samples
drop policy "product_samples_insert_own" on public.product_samples;
drop policy "product_samples_update_own" on public.product_samples;
create policy "product_samples_insert_own" on public.product_samples for insert to authenticated
  with check (representative_id in (select id from public.representatives where profile_id = (select auth.uid())));
create policy "product_samples_update_own" on public.product_samples for update to authenticated
  using (representative_id in (select id from public.representatives where profile_id = (select auth.uid())));

-- sample_requests
drop policy "sample_requests_select_related" on public.sample_requests;
drop policy "sample_requests_insert_own" on public.sample_requests;
drop policy "sample_requests_update_representative" on public.sample_requests;
create policy "sample_requests_select_related" on public.sample_requests for select to authenticated
  using (
    pharmacist_id in (select id from public.pharmacists where profile_id = (select auth.uid()))
    or representative_id in (select id from public.representatives where profile_id = (select auth.uid()))
  );
create policy "sample_requests_insert_own" on public.sample_requests for insert to authenticated
  with check (pharmacist_id in (select id from public.pharmacists where profile_id = (select auth.uid())));
create policy "sample_requests_update_representative" on public.sample_requests for update to authenticated
  using (representative_id in (select id from public.representatives where profile_id = (select auth.uid())));
