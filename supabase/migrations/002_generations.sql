create extension if not exists pgcrypto;

create table if not exists generations (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  status text not null check (status in ('pending', 'processing', 'done', 'failed')),
  input_urls text[] not null default '{}',
  output_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists generations_email_idx on generations (email);
create index if not exists generations_created_at_idx on generations (created_at desc);
