-- representative_regions: çakışmayı çöz (manage_own -> sadece yazma)
drop policy "representative_regions_manage_own" on public.representative_regions;
create policy "representative_regions_insert_own" on public.representative_regions for insert to authenticated
  with check (representative_id in (select id from public.representatives where profile_id = (select auth.uid())));
create policy "representative_regions_delete_own" on public.representative_regions for delete to authenticated
  using (representative_id in (select id from public.representatives where profile_id = (select auth.uid())));

-- representative_specialties: aynı düzeltme
drop policy "representative_specialties_manage_own" on public.representative_specialties;
create policy "representative_specialties_insert_own" on public.representative_specialties for insert to authenticated
  with check (representative_id in (select id from public.representatives where profile_id = (select auth.uid())));
create policy "representative_specialties_delete_own" on public.representative_specialties for delete to authenticated
  using (representative_id in (select id from public.representatives where profile_id = (select auth.uid())));

-- representative_documents: select_own + manage_own birebir aynı koşuldu, select_own'ı kaldırıyoruz
drop policy "representative_documents_select_own" on public.representative_documents;
drop policy "representative_documents_manage_own" on public.representative_documents;
create policy "representative_documents_select_own" on public.representative_documents for select to authenticated
  using (representative_id in (select id from public.representatives where profile_id = (select auth.uid())));
create policy "representative_documents_insert_own" on public.representative_documents for insert to authenticated
  with check (representative_id in (select id from public.representatives where profile_id = (select auth.uid())));
create policy "representative_documents_update_own" on public.representative_documents for update to authenticated
  using (representative_id in (select id from public.representatives where profile_id = (select auth.uid())));
create policy "representative_documents_delete_own" on public.representative_documents for delete to authenticated
  using (representative_id in (select id from public.representatives where profile_id = (select auth.uid())));

-- follows
drop policy "follows_select_related" on public.follows;
drop policy "follows_insert_own" on public.follows;
drop policy "follows_delete_own" on public.follows;
create policy "follows_select_related" on public.follows for select to authenticated
  using (
    pharmacist_id in (select id from public.pharmacists where profile_id = (select auth.uid()))
    or representative_id in (select id from public.representatives where profile_id = (select auth.uid()))
  );
create policy "follows_insert_own" on public.follows for insert to authenticated
  with check (pharmacist_id in (select id from public.pharmacists where profile_id = (select auth.uid())));
create policy "follows_delete_own" on public.follows for delete to authenticated
  using (pharmacist_id in (select id from public.pharmacists where profile_id = (select auth.uid())));

-- meeting_requests
drop policy "meeting_requests_select_related" on public.meeting_requests;
drop policy "meeting_requests_insert_own" on public.meeting_requests;
drop policy "meeting_requests_update_representative" on public.meeting_requests;
create policy "meeting_requests_select_related" on public.meeting_requests for select to authenticated
  using (
    pharmacist_id in (select id from public.pharmacists where profile_id = (select auth.uid()))
    or representative_id in (select id from public.representatives where profile_id = (select auth.uid()))
  );
create policy "meeting_requests_insert_own" on public.meeting_requests for insert to authenticated
  with check (pharmacist_id in (select id from public.pharmacists where profile_id = (select auth.uid())));
create policy "meeting_requests_update_representative" on public.meeting_requests for update to authenticated
  using (representative_id in (select id from public.representatives where profile_id = (select auth.uid())));

-- pharmacist_favorites
drop policy "pharmacist_favorites_manage_own" on public.pharmacist_favorites;
create policy "pharmacist_favorites_manage_own" on public.pharmacist_favorites for all to authenticated
  using (pharmacist_id in (select id from public.pharmacists where profile_id = (select auth.uid())))
  with check (pharmacist_id in (select id from public.pharmacists where profile_id = (select auth.uid())));

-- pharmacy_interests
drop policy "pharmacy_interests_manage_own" on public.pharmacy_interests;
create policy "pharmacy_interests_manage_own" on public.pharmacy_interests for all to authenticated
  using (pharmacist_id in (select id from public.pharmacists where profile_id = (select auth.uid())))
  with check (pharmacist_id in (select id from public.pharmacists where profile_id = (select auth.uid())));
