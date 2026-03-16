## Supabase Storage Setup for `portfolio-assets` Bucket

Use the steps below in the Supabase Dashboard (SQL editor) to create the storage bucket and configure Row Level Security (RLS).

### 1. Create the Bucket

Run this SQL in the Supabase SQL editor:

```sql
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do update
set public = excluded.public;
```

This creates (or updates) a bucket named `portfolio-assets` and marks it as public, which is required for anonymous read access to images.

### 2. Storage RLS Policies

Ensure that RLS is enabled for the bucket:

```sql
-- Enable RLS for objects in this bucket
alter table storage.objects
  enable row level security;
```

Now create policies so that:

- Public (anon) users can **read** files.
- Authenticated users can **insert**, **update**, and **delete** files.

```sql
-- Public read-only access to portfolio-assets
create policy "Public read portfolio-assets"
on storage.objects
for select
to anon
using (bucket_id = 'portfolio-assets');

-- Authenticated users can upload new files
create policy "Authenticated insert portfolio-assets"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'portfolio-assets');

-- Authenticated users can update existing files
create policy "Authenticated update portfolio-assets"
on storage.objects
for update
to authenticated
using (bucket_id = 'portfolio-assets')
with check (bucket_id = 'portfolio-assets');

-- Authenticated users can delete files
create policy "Authenticated delete portfolio-assets"
on storage.objects
for delete
to authenticated
using (bucket_id = 'portfolio-assets');
```

> Note: If you run these statements multiple times, you may need to manually drop or rename existing policies with the same names in the Supabase Dashboard.
