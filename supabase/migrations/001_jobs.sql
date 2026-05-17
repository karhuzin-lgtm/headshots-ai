-- Run in Supabase SQL editor or via CLI after linking project.
-- Create storage buckets in Dashboard: "uploads" and "generated" (private).

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'completed', 'failed')),
  plan text not null check (plan in ('basic', 'pro', 'executive')),
  style_keys text[] not null,
  input_paths text[] not null default '{}',
  output_paths text[] not null default '{}',
  total_outputs int not null,
  error text,
  paid boolean not null default false,
  stripe_checkout_session_id text
);

create index if not exists jobs_created_at_idx on public.jobs (created_at desc);

alter table public.jobs enable row level security;

-- No policies: only service role (server) accesses this table.
