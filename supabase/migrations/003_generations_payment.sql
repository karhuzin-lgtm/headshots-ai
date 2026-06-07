-- LavaTop payment gating for generations.
-- These columns are also created at runtime by ensureTuneIdColumn() in
-- src/lib/generations-db.ts, so this migration is idempotent and safe to re-run.

alter table generations add column if not exists paid boolean not null default false;
alter table generations add column if not exists payment_id text;

create index if not exists generations_payment_id_idx on generations (payment_id);
