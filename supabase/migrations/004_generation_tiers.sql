-- Tier support for generations: variable output count, style set, and quality
-- knobs per order. Also (re)asserts the payment/tune columns previously created
-- at runtime by ensureTuneIdColumn() in generations-db.ts (now removed).
-- Idempotent and safe to re-run.

alter table generations add column if not exists tune_id text;
alter table generations add column if not exists paid boolean not null default false;
alter table generations add column if not exists payment_id text;
alter table generations add column if not exists payment_url text;

alter table generations add column if not exists tier text not null default 'pro';
alter table generations add column if not exists expected_count int not null default 18;
alter table generations add column if not exists style_keys text[] not null default '{}';
alter table generations add column if not exists super_resolution boolean not null default false;
alter table generations add column if not exists inference_steps int not null default 30;
alter table generations add column if not exists training_steps int not null default 500;

create index if not exists generations_payment_id_idx on generations (payment_id);
