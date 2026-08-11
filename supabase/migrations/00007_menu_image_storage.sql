-- Kader — Supabase Storage bucket for uploaded menu images + public access policy

-- Create the menu_images bucket (idempotent)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('menu_images', 'menu_images', true, 10485760, '{"image/jpeg","image/png","image/webp"}')
on conflict (id) do nothing;

-- Public read access to files in the bucket
create policy "public read menu_images"
  on storage.objects
  for select using (bucket_id = 'menu_images');

-- Authenticated staff can upload/update/delete menu images
create policy "staff upload menu_images"
  on storage.objects
  for insert with check (bucket_id = 'menu_images' and auth.uid() is not null);
create policy "staff update menu_images"
  on storage.objects
  for update using (bucket_id = 'menu_images' and auth.uid() is not null)
  with check (bucket_id = 'menu_images' and auth.uid() is not null);
create policy "staff delete menu_images"
  on storage.objects
  for delete using (bucket_id = 'menu_images' and auth.uid() is not null);