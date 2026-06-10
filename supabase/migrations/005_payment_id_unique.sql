-- Enforce one generation per payment contract. Prevents a single contractId
-- from being attached to multiple generation rows (which getGenerationByPaymentId
-- would resolve arbitrarily via ORDER BY created_at DESC LIMIT 1).
--
-- The old non-unique index from 004 is dropped first to avoid index name collision.
-- Idempotent — safe to re-run.

drop index if exists generations_payment_id_idx;
create unique index if not exists generations_payment_id_key
  on generations (payment_id)
  where payment_id is not null;
