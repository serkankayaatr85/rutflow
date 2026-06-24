create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text := coalesce(new.raw_user_meta_data->>'role', 'pharmacist');
begin
  insert into public.profiles (id, role, full_name, email, phone_number)
  values (
    new.id,
    v_role,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    new.raw_user_meta_data->>'phone_number'
  );

  if v_role = 'pharmacist' then
    insert into public.pharmacists (profile_id, pharmacy_name, gln_code, license_number, city, district)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'pharmacy_name', ''),
      coalesce(new.raw_user_meta_data->>'gln_code', ''),
      coalesce(new.raw_user_meta_data->>'license_number', ''),
      coalesce(new.raw_user_meta_data->>'city', ''),
      new.raw_user_meta_data->>'district'
    );

  elsif v_role = 'representative' then
    insert into public.representatives (profile_id, company_name, region)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'company_name', ''),
      coalesce(new.raw_user_meta_data->>'region', '')
    );

  elsif v_role = 'company' then
    insert into public.companies (profile_id, company_name, contact_email, website_url)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'company_name', ''),
      new.raw_user_meta_data->>'contact_email',
      new.raw_user_meta_data->>'website_url'
    );
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
