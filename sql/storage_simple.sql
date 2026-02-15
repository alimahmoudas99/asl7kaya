-- Alternative: Create bucket without RLS first, then enable it.
-- Try running this block. If 'thumbnails' already exists, it will skip creation.

INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access (Read)
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'thumbnails' );

-- Allow authenticated uploads (Insert)
create policy "Authenticated Upload"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'thumbnails' );

-- Allow authenticated updates
create policy "Authenticated Update"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'thumbnails' );
