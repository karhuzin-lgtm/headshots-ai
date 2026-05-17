import { neon } from "@neondatabase/serverless";

function databaseUrl() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.POSTGRES_URL_NON_POOLING
  );
}

export async function migrateGenerationsSchema() {
  const url = databaseUrl();
  if (!url) throw new Error("Missing database connection string for migration.");

  const sql = neon(url);
  await sql`alter table generations add column if not exists error_message text`;
}
