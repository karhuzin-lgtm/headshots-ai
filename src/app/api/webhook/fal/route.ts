export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  const url = new URL(request.url);
  const generationId = url.searchParams.get("id");
  console.log("[webhook] ignored; generation now runs synchronously", { generationId });
  return Response.json({ ok: true, ignored: true });
}
