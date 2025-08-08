-- Create thumbnails table
create table if not exists public.thumbnails (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text,
  category text,
  tags text[],
  image_url text not null,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.thumbnails enable row level security;

-- Policies
create policy if not exists "Public can view published thumbnails"
  on public.thumbnails for select
  using (is_published = true);

create policy if not exists "Users can insert their own thumbnails"
  on public.thumbnails for insert
  with check (auth.uid() = user_id);

create policy if not exists "Users can update their own thumbnails"
  on public.thumbnails for update
  using (auth.uid() = user_id);

create policy if not exists "Users can delete their own thumbnails"
  on public.thumbnails for delete
  using (auth.uid() = user_id);

-- Timestamp trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_thumbnails_updated_at
before update on public.thumbnails
for each row execute function public.set_updated_at();

-- Create storage bucket for thumbnails (public read)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'thumbnails') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('thumbnails', 'thumbnails', true);
  END IF;
END $$;

-- Storage policies
create policy if not exists "Public can read thumbnails"
  on storage.objects for select
  using (bucket_id = 'thumbnails');

create policy if not exists "Users can upload to their folder"
  on storage.objects for insert
  with check (
    bucket_id = 'thumbnails'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "Users can update their own uploads"
  on storage.objects for update
  using (
    bucket_id = 'thumbnails'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy if not exists "Users can delete their own uploads"
  on storage.objects for delete
  using (
    bucket_id = 'thumbnails'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

-- Index for faster sorting
create index if not exists idx_thumbnails_created_at on public.thumbnails (created_at desc);
