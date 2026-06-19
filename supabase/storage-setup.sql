-- Run this in Supabase Dashboard → SQL Editor
-- Creates the product-images bucket and policies for admin uploads + public reads

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Anyone can view product images (needed for getPublicUrl on the storefront)
create policy "Public read product images"
on storage.objects
for select
to public
using (bucket_id = 'product-images');

-- Shop owners can upload images under their shop folder: {shop_id}/...
create policy "Shop owners upload product images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'product-images'
  and (storage.foldername(name))[1] in (
    select id::text from public.shops where owner_id = auth.uid()
  )
);

-- Shop owners can replace/update their own shop's images
create policy "Shop owners update product images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'product-images'
  and (storage.foldername(name))[1] in (
    select id::text from public.shops where owner_id = auth.uid()
  )
);

-- Shop owners can delete their own shop's images
create policy "Shop owners delete product images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'product-images'
  and (storage.foldername(name))[1] in (
    select id::text from public.shops where owner_id = auth.uid()
  )
);
