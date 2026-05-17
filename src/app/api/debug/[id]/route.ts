import { neon } from "@neondatabase/serverless";

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql`
    SELECT id, status, tune_id, output_urls, error_message, updated_at
    FROM generations
    WHERE id = ${params.id}
  `;

  return Response.json(rows[0] ?? { error: "not found" });
}
