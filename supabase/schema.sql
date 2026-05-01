create extension if not exists pgcrypto;

create table if not exists public.code_files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  language text not null default 'other',
  content text not null default '',
  storage_path text,
  file_size bigint not null default 0,
  file_type text not null default '',
  folder text not null default 'root',
  description text not null default '',
  tags text[] not null default '{}',
  is_starred boolean not null default false,
  created_date timestamptz not null default now(),
  updated_date timestamptz not null default now()
);

create index if not exists code_files_user_updated_idx
  on public.code_files (user_id, updated_date desc);

create index if not exists code_files_user_created_idx
  on public.code_files (user_id, created_date desc);

create or replace function public.set_code_files_updated_date()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_date = now();
  return new;
end;
$$;

drop trigger if exists set_code_files_updated_date on public.code_files;
create trigger set_code_files_updated_date
  before update on public.code_files
  for each row
  execute function public.set_code_files_updated_date();

alter table public.code_files enable row level security;

drop policy if exists "Users can read own code files" on public.code_files;
create policy "Users can read own code files"
  on public.code_files
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own code files" on public.code_files;
create policy "Users can insert own code files"
  on public.code_files
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own code files" on public.code_files;
create policy "Users can update own code files"
  on public.code_files
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own code files" on public.code_files;
create policy "Users can delete own code files"
  on public.code_files
  for delete
  to authenticated
  using (auth.uid() = user_id);

insert into storage.buckets (id, name, public, file_size_limit)
values ('code-files', 'code-files', false, 52428800)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit;

drop policy if exists "Users can read own stored code files" on storage.objects;
create policy "Users can read own stored code files"
  on storage.objects
  for select
  to authenticated
  using (
    bucket_id = 'code-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can upload own stored code files" on storage.objects;
create policy "Users can upload own stored code files"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'code-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can update own stored code files" on storage.objects;
create policy "Users can update own stored code files"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'code-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'code-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "Users can delete own stored code files" on storage.objects;
create policy "Users can delete own stored code files"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'code-files'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
