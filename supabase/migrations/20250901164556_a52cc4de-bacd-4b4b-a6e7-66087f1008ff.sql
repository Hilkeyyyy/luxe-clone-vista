-- Create public bucket for Instagram images
insert into storage.buckets (id, name, public) values ('instagram-images', 'instagram-images', true) on conflict (id) do nothing;

-- Policies for instagram-images
-- Public read
create policy if not exists "Public read instagram images" on storage.objects
for select using (bucket_id = 'instagram-images');

-- Authenticated can insert/update/delete
create policy if not exists "Authenticated insert instagram images" on storage.objects
for insert with check (
  bucket_id = 'instagram-images' and auth.role() = 'authenticated'
);

create policy if not exists "Authenticated update instagram images" on storage.objects
for update using (
  bucket_id = 'instagram-images' and auth.role() = 'authenticated'
);

create policy if not exists "Authenticated delete instagram images" on storage.objects
for delete using (
  bucket_id = 'instagram-images' and auth.role() = 'authenticated'
);
