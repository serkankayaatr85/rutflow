alter table public.products rename column product_name to name;
alter table public.products add column if not exists category_id uuid references public.product_categories(id);
alter table public.products drop column if exists category;
alter table public.products drop column if exists brand;
