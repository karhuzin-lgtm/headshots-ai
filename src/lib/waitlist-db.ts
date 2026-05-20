import { neon } from "@neondatabase/serverless";

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

async function ensureWaitlistTable() {
  const sql = getSql();
  await sql`
    create table if not exists waitlist_emails (
      email text primary key,
      created_at timestamptz not null default now()
    )
  `;
}

export async function getWaitlistCount(): Promise<number> {
  await ensureWaitlistTable();
  const sql = getSql();
  const rows = await sql`select count(*)::int as count from waitlist_emails`;
  return Number(rows[0]?.count ?? 0);
}

export async function insertWaitlistEmail(email: string): Promise<"inserted" | "duplicate"> {
  await ensureWaitlistTable();
  const sql = getSql();
  const rows = await sql`
    insert into waitlist_emails (email)
    values (${email})
    on conflict (email) do nothing
    returning email
  `;
  return rows.length > 0 ? "inserted" : "duplicate";
}
