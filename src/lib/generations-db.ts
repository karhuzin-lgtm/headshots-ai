import { neon } from "@neondatabase/serverless";

export type GenerationStatus = "pending" | "processing" | "done" | "failed";

export type GenerationRow = {
  id: string;
  email: string;
  status: GenerationStatus;
  input_urls: string[];
  output_urls: string[];
  tune_id: string | null;
  error_message: string | null;
  paid: boolean;
  payment_id: string | null;
  payment_url: string | null;
  // Tier snapshot (resolved at creation so an in-flight order is unaffected by
  // later config changes). See src/lib/tiers.ts.
  tier: string;
  expected_count: number;
  style_keys: string[];
  super_resolution: boolean;
  inference_steps: number;
  training_steps: number;
  created_at: string;
  updated_at: string;
};

/** Default tier snapshot (mirrors the "pro" tier) used when a caller omits values. */
const DEFAULT_STYLE_KEYS = [
  "linkedin",
  "corporate",
  "executive",
  "tech",
  "creative",
  "startup",
];
const DEFAULT_EXPECTED_COUNT = 18;
const DEFAULT_INFERENCE_STEPS = 30;
const DEFAULT_TRAINING_STEPS = 500;

function getSql() {
  const databaseUrl =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING;

  if (!databaseUrl) {
    throw new Error(
      "Missing database connection string. Set DATABASE_URL or POSTGRES_URL in Vercel env."
    );
  }

  return neon(databaseUrl);
}

// Ensure the schema once per lambda instance (not per query). Idempotent and
// additive — lets a fresh deploy work even before migration 004 is applied,
// without the old per-query DDL cost. Mirrors supabase/migrations/004.
let schemaReady: Promise<void> | null = null;
function ensureSchema(): Promise<void> {
  if (schemaReady) return schemaReady;
  const sql = getSql();
  schemaReady = (async () => {
    await sql`alter table generations add column if not exists tune_id text`;
    await sql`alter table generations add column if not exists paid boolean not null default false`;
    await sql`alter table generations add column if not exists payment_id text`;
    await sql`alter table generations add column if not exists payment_url text`;
    await sql`alter table generations add column if not exists tier text not null default 'pro'`;
    await sql`alter table generations add column if not exists expected_count int not null default 18`;
    await sql`alter table generations add column if not exists style_keys text[] not null default '{}'`;
    await sql`alter table generations add column if not exists super_resolution boolean not null default false`;
    await sql`alter table generations add column if not exists inference_steps int not null default 30`;
    await sql`alter table generations add column if not exists training_steps int not null default 500`;
  })().catch((error) => {
    schemaReady = null; // allow retry on next call
    throw error;
  });
  return schemaReady;
}

function textArray(values: string[]): string {
  // Postgres array literal for use ONLY inside parameterized neon`` queries.
  return `{${values.map((value) => `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).join(",")}}`;
}

function intOr(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function mapGeneration(row: Record<string, unknown>): GenerationRow {
  return {
    id: String(row.id),
    email: String(row.email),
    status: row.status as GenerationStatus,
    input_urls: Array.isArray(row.input_urls) ? (row.input_urls as string[]) : [],
    output_urls: Array.isArray(row.output_urls) ? (row.output_urls as string[]) : [],
    tune_id: typeof row.tune_id === "string" ? row.tune_id : null,
    error_message: typeof row.error_message === "string" ? row.error_message : null,
    paid: row.paid === true,
    payment_id: typeof row.payment_id === "string" ? row.payment_id : null,
    payment_url: typeof row.payment_url === "string" ? row.payment_url : null,
    tier: typeof row.tier === "string" && row.tier ? row.tier : "pro",
    expected_count: intOr(row.expected_count, DEFAULT_EXPECTED_COUNT),
    style_keys:
      Array.isArray(row.style_keys) && row.style_keys.length
        ? (row.style_keys as string[])
        : DEFAULT_STYLE_KEYS,
    super_resolution: row.super_resolution === true,
    inference_steps: intOr(row.inference_steps, DEFAULT_INFERENCE_STEPS),
    training_steps: intOr(row.training_steps, DEFAULT_TRAINING_STEPS),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function createGeneration(input: {
  email: string;
  inputUrls: string[];
  paymentId?: string | null;
  tier?: string;
  expectedCount?: number;
  styleKeys?: string[];
  superResolution?: boolean;
  inferenceSteps?: number;
  trainingSteps?: number;
}): Promise<GenerationRow> {
  await ensureSchema();
  const sql = getSql();
  const tier = input.tier ?? "pro";
  const styleKeys = input.styleKeys?.length ? input.styleKeys : DEFAULT_STYLE_KEYS;
  const expectedCount = input.expectedCount ?? DEFAULT_EXPECTED_COUNT;
  const superResolution = input.superResolution ?? false;
  const inferenceSteps = input.inferenceSteps ?? DEFAULT_INFERENCE_STEPS;
  const trainingSteps = input.trainingSteps ?? DEFAULT_TRAINING_STEPS;

  const rows = await sql`
    insert into generations (
      email, status, input_urls, output_urls, payment_id,
      tier, expected_count, style_keys, super_resolution, inference_steps, training_steps
    )
    values (
      ${input.email},
      'pending',
      ${textArray(input.inputUrls)}::text[],
      '{}'::text[],
      ${input.paymentId ?? null},
      ${tier},
      ${expectedCount},
      ${textArray(styleKeys)}::text[],
      ${superResolution},
      ${inferenceSteps},
      ${trainingSteps}
    )
    returning *
  `;
  return mapGeneration(rows[0]);
}

export async function attachPaymentInfo(input: {
  id: string;
  paymentId: string;
  paymentUrl: string;
}): Promise<void> {
  const sql = getSql();
  await sql`
    update generations
    set payment_id = ${input.paymentId},
        payment_url = ${input.paymentUrl},
        updated_at = now()
    where id = ${input.id}
  `;
}

/** Mark a generation as paid. Returns the row, or null if not found. */
export async function markGenerationPaid(id: string): Promise<GenerationRow | null> {
  const sql = getSql();
  const rows = await sql`
    update generations
    set paid = true, updated_at = now()
    where id = ${id}
    returning *
  `;
  return rows[0] ? mapGeneration(rows[0]) : null;
}

export async function getGenerationByPaymentId(
  paymentId: string
): Promise<GenerationRow | null> {
  const sql = getSql();
  const rows = await sql`
    select *
    from generations
    where payment_id = ${paymentId}
    order by created_at desc
    limit 1
  `;
  return rows[0] ? mapGeneration(rows[0]) : null;
}

/**
 * Most recent unpaid, not-yet-started generation for an email (webhook fallback
 * match when contractId didn't resolve). Returns null when ambiguous (more than
 * one candidate) to avoid attaching a payment to the wrong upload.
 */
export async function findPendingUnpaidGeneration(
  email: string
): Promise<GenerationRow | null> {
  const sql = getSql();
  const rows = await sql`
    select *
    from generations
    where email = ${email}
      and paid = false
      and status = 'pending'
    order by created_at desc
    limit 2
  `;
  if (rows.length !== 1) return null;
  return mapGeneration(rows[0]);
}

export async function updateGenerationStatus(input: {
  id: string;
  status: GenerationStatus;
  outputUrls?: string[];
  tuneId?: string | null;
  errorMessage?: string | null;
}): Promise<GenerationRow> {
  const sql = getSql();
  const rows = await sql`
    update generations
    set
      status = ${input.status},
      output_urls = coalesce(${input.outputUrls ? textArray(input.outputUrls) : null}::text[], output_urls),
      tune_id = coalesce(${input.tuneId ?? null}, tune_id),
      error_message = ${input.errorMessage ?? null},
      updated_at = now()
    where id = ${input.id}
      and status <> 'done'
    returning *
  `;
  if (rows[0]) return mapGeneration(rows[0]);
  // Row is already done — re-read without modification so callers get the row.
  const current = await getGeneration(input.id);
  if (!current) throw new Error(`Generation ${input.id} not found`);
  return current;
}

export async function getGeneration(id: string): Promise<GenerationRow | null> {
  const sql = getSql();
  const rows = await sql`
    select *
    from generations
    where id = ${id}
    limit 1
  `;
  return rows[0] ? mapGeneration(rows[0]) : null;
}

export async function findRateLimitedGeneration(email: string): Promise<GenerationRow | null> {
  const sql = getSql();
  const rows = await sql`
    select *
    from generations
    where email = ${email}
      and paid = true
      and (
        status in ('pending', 'processing')
        or (status = 'done' and created_at > now() - interval '24 hours')
      )
    order by created_at desc
    limit 1
  `;
  return rows[0] ? mapGeneration(rows[0]) : null;
}

/** Count recent unpaid attempts for an email — lightweight create-spam throttle. */
export async function countRecentUnpaidGenerations(
  email: string,
  withinMinutes: number
): Promise<number> {
  const sql = getSql();
  const rows = await sql`
    select count(*)::int as n
    from generations
    where email = ${email}
      and paid = false
      and created_at > now() - (${withinMinutes} * interval '1 minute')
  `;
  return intOr(rows[0]?.n, 0);
}

/**
 * Atomically claim a generation for processing. Returns the row only if THIS
 * call won the claim: the row is paid, has no tune yet, and is in a safe
 * retry state. Rows with ASTRIA_STATUS_UNKNOWN error are excluded to prevent
 * duplicate Astria billing when the tune status is ambiguous.
 */
export async function claimGenerationForProcessing(
  id: string
): Promise<GenerationRow | null> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    update generations
    set status = 'processing', updated_at = now()
    where id = ${id}
      and paid = true
      and tune_id is null
      and status in ('pending', 'failed')
      and (error_message is null or error_message not like 'ASTRIA_STATUS_UNKNOWN:%')
    returning *
  `;
  return rows[0] ? mapGeneration(rows[0]) : null;
}

/** Persist the LavaTop contractId so webhook retries can match by payment_id. */
export async function setGenerationPaymentId(id: string, paymentId: string): Promise<void> {
  await ensureSchema();
  const sql = getSql();
  await sql`
    update generations set payment_id = ${paymentId}, updated_at = now() where id = ${id}
  `;
}

/**
 * Atomically union new output URLs into the row and flip to 'done' when the
 * count reaches expected_count.
 *
 * The merge is expressed as inline subqueries inside the UPDATE SET clause.
 * PostgreSQL acquires a row-level lock before evaluating any SET expression,
 * so concurrent callbacks see the committed state after the prior update
 * rather than a stale CTE snapshot — this eliminates the lost-update race.
 *
 * Allows failed→done recovery: late callbacks still deliver images even if
 * an earlier error set status=failed (e.g. after a tune-creation timeout).
 *
 * Returns null if the row was already done (no-op) or not found.
 */
export async function appendGenerationOutputs(
  id: string,
  incoming: string[]
): Promise<{ row: GenerationRow; becameDone: boolean } | null> {
  await ensureSchema();
  const sql = getSql();
  const incomingArr = textArray(incoming);
  const rows = await sql`
    update generations
    set
      output_urls = (
        select coalesce(array_agg(distinct u), '{}')
        from unnest(output_urls || ${incomingArr}::text[]) as u
      ),
      status = case
                 when (
                   select cardinality(coalesce(array_agg(distinct u), '{}')::text[])
                   from unnest(output_urls || ${incomingArr}::text[]) as u
                 ) >= expected_count
                 then 'done'
                 else status
               end,
      updated_at = now()
    where id = ${id}
      and status <> 'done'
    returning *
  `;
  if (!rows[0]) return null;
  const row = mapGeneration(rows[0]);
  // If the returned row is 'done', THIS call caused the transition —
  // the WHERE status <> 'done' guard ensures it was not done before.
  const becameDone = row.status === "done";
  return { row, becameDone };
}
