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
  await sql`
    alter table waitlist_emails
      add column if not exists privacy_accepted boolean not null default false,
      add column if not exists terms_accepted boolean not null default false,
      add column if not exists marketing_consent boolean not null default false,
      add column if not exists unsubscribed_at timestamptz
  `;
}

export async function getWaitlistCount(): Promise<number> {
  await ensureWaitlistTable();
  const sql = getSql();
  const rows = await sql`
    select count(*)::int as count
    from waitlist_emails
    where unsubscribed_at is null
  `;
  return Number(rows[0]?.count ?? 0);
}

export type WaitlistSignupInput = {
  email: string;
  privacyAccepted: boolean;
  termsAccepted: boolean;
  marketingConsent: boolean;
};

export async function insertWaitlistEmail(input: WaitlistSignupInput): Promise<"inserted" | "duplicate"> {
  await ensureWaitlistTable();
  const sql = getSql();
  const rows = await sql`
    insert into waitlist_emails (
      email,
      privacy_accepted,
      terms_accepted,
      marketing_consent,
      unsubscribed_at
    )
    values (
      ${input.email},
      ${input.privacyAccepted},
      ${input.termsAccepted},
      ${input.marketingConsent},
      null
    )
    on conflict (email) do update
      set privacy_accepted = excluded.privacy_accepted,
          terms_accepted = excluded.terms_accepted,
          marketing_consent = excluded.marketing_consent,
          unsubscribed_at = null
      where waitlist_emails.unsubscribed_at is not null
    returning email
  `;
  return rows.length > 0 ? "inserted" : "duplicate";
}

export async function unsubscribeWaitlistEmail(email: string): Promise<boolean> {
  await ensureWaitlistTable();
  const sql = getSql();
  const rows = await sql`
    update waitlist_emails
    set unsubscribed_at = now(), marketing_consent = false
    where email = ${email}
    returning email
  `;
  return rows.length > 0;
}
