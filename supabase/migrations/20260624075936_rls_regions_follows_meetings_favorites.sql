alter table public.regions enable row level security;
alter table public.representative_regions enable row level security;
alter table public.representative_specialties enable row level security;
alter table public.representative_documents enable row level security;
alter table public.pharmacist_favorites enable row level security;
alter table public.pharmacy_interests enable row level security;

create policy "regions_select_authenticated" on public.regions for select to authenticated using (true);

create policy "representative_regions_select_authenticated" on public.representative_regions for select to authenticated using (true);
create policy "representative_regions_manage_own" on public.representative_regions for all to authenticated
  using (representative_id in (select id from public.representatives where profile_id = auth.uid()))
  with check (representative_id in (select id from public.representatives where profile_id = auth.uid()));

create policy "representative_specialties_select_authenticated" on public.representative_specialties for select to authenticated using (true);
create policy "representative_specialties_manage_own" on public.representative_specialties for all to authenticated
  using (representative_id in (select id from public.representatives where profile_id = auth.uid()))
  with check (representative_id in (select id from public.representatives where profile_id = auth.uid()));

create policy "representative_documents_select_own" on public.representative_documents for select to authenticated
  using (representative_id in (select id from public.representatives where profile_id = auth.uid()));
create policy "representative_documents_manage_own" on public.representative_documents for all to authenticated
  using (representative_id in (select id from public.representatives where profile_id = auth.uid()))
  with check (representative_id in (select id from public.representatives where profile_id = auth.uid()));

create policy "follows_select_related" on public.follows for select to authenticated
  using (
    pharmacist_id in (select id from public.pharmacists where profile_id = auth.uid())
    or representative_id in (select id from public.representatives where profile_id = auth.uid())
  );
create policy "follows_insert_own" on public.follows for insert to authenticated
  with check (pharmacist_id in (select id from public.pharmacists where profile_id = auth.uid()));
create policy "follows_delete_own" on public.follows for delete to authenticated
  using (pharmacist_id in (select id from public.pharmacists where profile_id = auth.uid()));

create policy "meeting_requests_select_related" on public.meeting_requests for select to authenticated
  using (
    pharmacist_id in (select id from public.pharmacists where profile_id = auth.uid())
    or representative_id in (select id from public.representatives where profile_id = auth.uid())
  );
create policy "meeting_requests_insert_own" on public.meeting_requests for insert to authenticated
  with check (pharmacist_id in (select id from public.pharmacists where profile_id = auth.uid()));
create policy "meeting_requests_update_representative" on public.meeting_requests for update to authenticated
  using (representative_id in (select id from public.representatives where profile_id = auth.uid()));

create policy "pharmacist_favorites_manage_own" on public.pharmacist_favorites for all to authenticated
  using (pharmacist_id in (select id from public.pharmacists where profile_id = auth.uid()))
  with check (pharmacist_id in (select id from public.pharmacists where profile_id = auth.uid()));

create policy "pharmacy_interests_manage_own" on public.pharmacy_interests for all to authenticated
  using (pharmacist_id in (select id from public.pharmacists where profile_id = auth.uid()))
  with check (pharmacist_id in (select id from public.pharmacists where profile_id = auth.uid()));
