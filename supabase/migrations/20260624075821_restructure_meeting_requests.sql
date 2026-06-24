alter table public.meeting_requests add column if not exists type text;
update public.meeting_requests set type = 'message' where type is null;
alter table public.meeting_requests alter column type set not null;
alter table public.meeting_requests add constraint meeting_requests_type_check
  check (type = any (array['phone','visit','message']));

alter table public.meeting_requests drop constraint if exists meeting_requests_status_check;
alter table public.meeting_requests add constraint meeting_requests_status_check
  check (status = any (array['pending','accepted','rejected','completed']));
