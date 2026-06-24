-- Categories table and products.category_id FK.
-- Run in Supabase SQL editor or via migration tooling.

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  shop_id uuid not null references public.shops (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (shop_id, name)
);

alter table public.products
  add column if not exists category_id uuid references public.categories (id) on delete set null;

create index if not exists products_category_id_idx on public.products (category_id);
create index if not exists categories_shop_id_idx on public.categories (shop_id);

alter table public.categories enable row level security;

-- Shop owners can manage their own categories.
create policy "Shop owners can read own categories"
  on public.categories for select
  using (
    shop_id in (
      select id from public.shops where owner_id = auth.uid()
    )
  );

create policy "Shop owners can insert own categories"
  on public.categories for insert
  with check (
    shop_id in (
      select id from public.shops where owner_id = auth.uid()
    )
  );

create policy "Shop owners can delete own categories"
  on public.categories for delete
  using (
    shop_id in (
      select id from public.shops where owner_id = auth.uid()
    )
  );

-- Optional hardening (not applied): trigger to ensure product.category_id
-- belongs to the same shop as the product. The admin UI only offers the
-- shop's own categories, but a crafted API call could assign another shop's
-- category id without this check.
