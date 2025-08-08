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

-- Policies with guards
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'thumbnails' AND policyname = 'Public can view published thumbnails'
  ) THEN
    CREATE POLICY "Public can view published thumbnails"
      ON public.thumbnails FOR SELECT
      USING (is_published = true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'thumbnails' AND policyname = 'Users can insert their own thumbnails'
  ) THEN
    CREATE POLICY "Users can insert their own thumbnails"
      ON public.thumbnails FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'thumbnails' AND policyname = 'Users can update their own thumbnails'
  ) THEN
    CREATE POLICY "Users can update their own thumbnails"
      ON public.thumbnails FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'thumbnails' AND policyname = 'Users can delete their own thumbnails'
  ) THEN
    CREATE POLICY "Users can delete their own thumbnails"
      ON public.thumbnails FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Timestamp trigger
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

DROP TRIGGER IF EXISTS set_thumbnails_updated_at ON public.thumbnails;
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

-- Storage policies with guards
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public can read thumbnails'
  ) THEN
    CREATE POLICY "Public can read thumbnails"
      ON storage.objects FOR SELECT
      USING (bucket_id = 'thumbnails');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can upload to their folder'
  ) THEN
    CREATE POLICY "Users can upload to their folder"
      ON storage.objects FOR INSERT
      WITH CHECK (
        bucket_id = 'thumbnails'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can update their own uploads'
  ) THEN
    CREATE POLICY "Users can update their own uploads"
      ON storage.objects FOR UPDATE
      USING (
        bucket_id = 'thumbnails'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Users can delete their own uploads'
  ) THEN
    CREATE POLICY "Users can delete their own uploads"
      ON storage.objects FOR DELETE
      USING (
        bucket_id = 'thumbnails'
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
  END IF;
END $$;

-- Index for faster sorting
create index if not exists idx_thumbnails_created_at on public.thumbnails (created_at desc);
