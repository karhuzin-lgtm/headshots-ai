import { neon } from "@neondatabase/serverless";
import { VALID_STYLE_KEYS } from "@/lib/astria";

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

// Schema guard: verifies the DB connection is live. All DDL (ALTER TABLE,
// CREATE INDEX) lives exclusively in supabase/migrations/ and must be applied
// before deploy — NOT at runtime. This avoids table-level locks on cold starts
// that could block webhooks and user requests.
//
// Migration order: 001_jobs → 002_generations → 003_generations_payment
//                  → 004_generation_tiers → 005_payment_id_unique
let schemaReady: Promise<void> | null = null;
function ensureSchema(): Promise<void> {
  if (schemaReady) return schemaReady;
  const sql = getSql();
  // Lightweight connection check — one row read is enough to confirm the DB
  // is reachable and the migrations have been applied.
  schemaReady = sql`select 1 from generations limit 0`.then(() => undefined).catch((error) => {
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

  if (!input.inputUrls.length || input.inputUrls.length > 20)
    throw new Error(`inputUrls must have 1–20 entries, got ${input.inputUrls.length}`);
  for (const url of input.inputUrls) {
    if (typeof url !== "string" || url.length > 2048)
      throw new Error("inputUrls contains an invalid or too-long entry");
    let parsed: URL;
    try {
      parsed = new URL(url);
    } catch {
      throw new Error(`inputUrls contains a malformed URL: ${url.slice(0, 100)}`);
    }
    if (parsed.protocol !== "https:")
      throw new Error(`inputUrls must use https, got ${parsed.protocol}`);
    // Restrict to Vercel Blob storage to prevent Astria from being used as an
    // SSRF proxy to reach private networks or incur unexpected egress costs.
    if (!parsed.hostname.endsWith(".blob.vercel-storage.com"))
      throw new Error(`inputUrls must be from Vercel Blob storage, got ${parsed.hostname}`);
  }
  if (!Number.isInteger(expectedCount) || expectedCount <= 0 || expectedCount > 100)
    throw new Error(`expectedCount must be 1–100, got ${expectedCount}`);
  if (!Number.isInteger(inferenceSteps) || inferenceSteps <= 0 || inferenceSteps > 150)
    throw new Error(`inferenceSteps must be 1–150, got ${inferenceSteps}`);
  if (!Number.isInteger(trainingSteps) || trainingSteps <= 0 || trainingSteps > 2000)
    throw new Error(`trainingSteps must be 1–2000, got ${trainingSteps}`);
  if (styleKeys.length > 200)
    throw new Error(`styleKeys raw array too large (${styleKeys.length}), max 200`);
  const uniqueStyleKeys = Array.from(new Set(styleKeys));
  if (!uniqueStyleKeys.length || uniqueStyleKeys.length > 20)
    throw new Error(`styleKeys must have 1–20 unique entries, got ${uniqueStyleKeys.length}`);
  const unknownStyles = uniqueStyleKeys.filter((k) => !VALID_STYLE_KEYS.has(k));
  if (unknownStyles.length)
    throw new Error(`styleKeys contains unknown styles: [${unknownStyles.join(",")}]`);
  if (expectedCount < uniqueStyleKeys.length)
    throw new Error(
      `expectedCount (${expectedCount}) must be >= number of unique styles (${uniqueStyleKeys.length})`
    );

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
      ${textArray(uniqueStyleKeys)}::text[],
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
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    update generations
    set payment_id = ${input.paymentId},
        payment_url = ${input.paymentUrl},
        updated_at = now()
    where id = ${input.id}
      and (payment_id is null or payment_id = ${input.paymentId})
    returning id
  `;
  if (!rows[0])
    throw new Error(`attachPaymentInfo: generation ${input.id} not found or payment_id conflict`);
}

/**
 * Persist the LavaTop contractId so webhook retries can match by payment_id.
 * Returns true when the row was updated, false when:
 *   - the generation was not found, OR
 *   - payment_id is already set to a DIFFERENT value (conflict — skip, don't retry).
 * Never overwrites an existing, differing payment_id.
 */
export async function setGenerationPaymentId(id: string, paymentId: string): Promise<boolean> {
  await ensureSchema();
  const sql = getSql();
  const rows = await sql`
    update generations
    set payment_id = ${paymentId}, updated_at = now()
    where id = ${id}
      and (payment_id is null or payment_id = ${paymentId})
    returning id
  `;
  return !!rows[0];
}

/**
 * Mark a generation as paid, verified against the expected payment_id to
 * prevent one payment event from activating an unrelated generation row.
 *
 * Idempotent: if the row is already paid with the SAME payment_id (e.g. a
 * webhook retry after a transient Astria error), returns the existing row so
 * the caller can re-attempt startAstriaGeneration without losing the order.
 *
 * Returns null if not found or payment_id mismatches (wrong generation).
 */
export async function markGenerationPaid(
  id: string,
  paymentId: string
): Promise<GenerationRow | null> {
  await ensureSchema();
  const sql = getSql();
  const updated = await sql`
    update generations
    set paid = true, updated_at = now()
    where id = ${id}
      and payment_id = ${paymentId}
      and paid = false
    returning *
  `;
  if (updated[0]) return mapGeneration(updated[0]);
  // Row was already paid with the same payment_id — idempotent retry path.
  const existing = await sql`
    select * from generations
    where id = ${id}
      and payment_id = ${paymentId}
      and paid = true
    limit 1
  `;
  return existing[0] ? mapGeneration(existing[0]) : null;
}

export async function getGenerationByPaymentId(
  paymentId: string
): Promise<GenerationRow | null> {
  await ensureSchema();
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
  await ensureSchema();
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
  /** Set only to store a new tuneId — coalesce keeps existing value; cannot clear. */
  tuneId?: string;
  errorMessage?: string | null;
}): Promise<GenerationRow> {
  await ensureSchema();
  const sql = getSql();
  // For done rows: status, output_urls, and error_message are immutable.
  // tune_id is allowed to be filled in even for done rows (late webhook completing
  // the tuneId after the Astria callback already set status=done).
  const rows = await sql`
    update generations
    set
      status      = case when status = 'done' then 'done' else ${input.status} end,
      output_urls = case when status = 'done' then output_urls
                         else coalesce(${input.outputUrls !== undefined ? textArray(input.outputUrls) : null}::text[], output_urls)
                    end,
      tune_id     = coalesce(${input.tuneId ?? null}, tune_id),
      error_message = case when status = 'done' then error_message else ${input.errorMessage ?? null} end,
      updated_at  = now()
    where id = ${input.id}
    returning *
  `;
  if (rows[0]) return mapGeneration(rows[0]);
  throw new Error(`Generation ${input.id} not found`);
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

export async function getGeneration(id: string): Promise<GenerationRow | null> {
  await ensureSchema();
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
  await ensureSchema();
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
  if (!Number.isInteger(withinMinutes) || withinMinutes <= 0 || withinMinutes > 1440)
    throw new Error(`withinMinutes must be 1–1440, got ${withinMinutes}`);
  await ensureSchema();
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
 * call won the claim. Conditions:
 * - paid=true (never start Astria for unpaid orders)
 * - tune_id is null (tune not yet created)
 * - status in ('pending', 'failed') — only safe retry states
 * - Not marked ASTRIA_STATUS_UNKNOWN: blocks retry when Astria status is
 *   ambiguous (timeout/5xx) to prevent duplicate billing. Admin must verify
 *   via fetchTuneOutputUrls before clearing the UNKNOWN marker.
 *
 * Note: a process crash between claim and tuneId save leaves the row in
 * status='processing' with tune_id=null. That row is NOT re-claimable here
 * to avoid a potential second Astria billing. Admin recovery: if Astria
 * created the tune, fetch the tuneId via fetchTuneOutputUrls and update
 * directly; otherwise reset status to 'pending'.
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
      and (
        -- Normal retry: pending or failed (not UNKNOWN-blocked).
        (
          status in ('pending', 'failed')
          and (error_message is null or error_message not like 'ASTRIA_STATUS_UNKNOWN:%')
        )
        -- Stale-processing recovery: claimed but tuneId never saved and
        -- Astria did not callback within 15 minutes → assume no tune was
        -- created and allow retry. 15 min > typical Astria training time;
        -- if the tune was created, the callback will arrive and set tune_id.
        or (
          status = 'processing'
          and updated_at < now() - interval '15 minutes'
        )
      )
    returning *
  `;
  return rows[0] ? mapGeneration(rows[0]) : null;
}

