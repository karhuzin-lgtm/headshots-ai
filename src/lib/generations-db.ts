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
  created_at: string;
  updated_at: string;
};

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

function textArray(values: string[]): string {
  return `{${values.map((value) => `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`).join(",")}}`;
}

async function ensureTuneIdColumn() {
  const sql = getSql();
  await sql`alter table generations add column if not exists tune_id text`;
  await sql`alter table generations add column if not exists paid boolean not null default false`;
  await sql`alter table generations add column if not exists payment_id text`;
  await sql`alter table generations add column if not exists payment_url text`;
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
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function createGeneration(input: {
  email: string;
  inputUrls: string[];
  paymentId?: string | null;
}): Promise<GenerationRow> {
  await ensureTuneIdColumn();
  const sql = getSql();
  const rows = await sql`
    insert into generations (email, status, input_urls, output_urls, payment_id)
    values (
      ${input.email},
      'pending',
      ${textArray(input.inputUrls)}::text[],
      '{}'::text[],
      ${input.paymentId ?? null}
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
  await ensureTuneIdColumn();
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
  await ensureTuneIdColumn();
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
  await ensureTuneIdColumn();
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

/** Most recent unpaid, not-yet-started generation for an email (webhook fallback match). */
export async function findPendingUnpaidGeneration(
  email: string
): Promise<GenerationRow | null> {
  await ensureTuneIdColumn();
  const sql = getSql();
  const rows = await sql`
    select *
    from generations
    where email = ${email}
      and paid = false
      and status = 'pending'
    order by created_at desc
    limit 1
  `;
  return rows[0] ? mapGeneration(rows[0]) : null;
}

export async function updateGenerationStatus(input: {
  id: string;
  status: GenerationStatus;
  outputUrls?: string[];
  tuneId?: string | null;
  errorMessage?: string | null;
}): Promise<GenerationRow> {
  await ensureTuneIdColumn();
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
    returning *
  `;
  return mapGeneration(rows[0]);
}

export async function getGeneration(id: string): Promise<GenerationRow | null> {
  await ensureTuneIdColumn();
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
  await ensureTuneIdColumn();
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
