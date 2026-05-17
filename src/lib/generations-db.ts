import { neon } from "@neondatabase/serverless";

export type GenerationStatus = "pending" | "processing" | "done" | "failed";

export type GenerationRow = {
  id: string;
  email: string;
  status: GenerationStatus;
  input_urls: string[];
  output_urls: string[];
  error_message: string | null;
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

function mapGeneration(row: Record<string, unknown>): GenerationRow {
  return {
    id: String(row.id),
    email: String(row.email),
    status: row.status as GenerationStatus,
    input_urls: Array.isArray(row.input_urls) ? (row.input_urls as string[]) : [],
    output_urls: Array.isArray(row.output_urls) ? (row.output_urls as string[]) : [],
    error_message: typeof row.error_message === "string" ? row.error_message : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function createGeneration(input: {
  email: string;
  inputUrls: string[];
}): Promise<GenerationRow> {
  const sql = getSql();
  const rows = await sql`
    insert into generations (email, status, input_urls, output_urls)
    values (${input.email}, 'pending', ${textArray(input.inputUrls)}::text[], '{}'::text[])
    returning *
  `;
  return mapGeneration(rows[0]);
}

export async function updateGenerationStatus(input: {
  id: string;
  status: GenerationStatus;
  outputUrls?: string[];
  errorMessage?: string | null;
}): Promise<GenerationRow> {
  const sql = getSql();
  const rows = await sql`
    update generations
    set
      status = ${input.status},
      output_urls = coalesce(${input.outputUrls ? textArray(input.outputUrls) : null}::text[], output_urls),
      error_message = ${input.errorMessage ?? null},
      updated_at = now()
    where id = ${input.id}
    returning *
  `;
  return mapGeneration(rows[0]);
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
      and (
        status in ('pending', 'processing')
        or (status = 'done' and created_at > now() - interval '24 hours')
      )
    order by created_at desc
    limit 1
  `;
  return rows[0] ? mapGeneration(rows[0]) : null;
}
