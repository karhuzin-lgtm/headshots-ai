import { NextResponse } from "next/server";

function sanitizeFilename(filename: string | null): string {
  const fallback = "headshot.jpg";
  if (!filename) return fallback;
  return filename.replace(/[^a-z0-9._-]/gi, "-") || fallback;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get("url");
  const filename = sanitizeFilename(searchParams.get("filename"));

  if (!imageUrl) {
    return NextResponse.json({ error: "Missing image URL." }, { status: 400 });
  }

  let url: URL;
  try {
    url = new URL(imageUrl);
  } catch {
    return NextResponse.json({ error: "Invalid image URL." }, { status: 400 });
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return NextResponse.json({ error: "Unsupported image URL." }, { status: 400 });
  }

  const imageResponse = await fetch(url, { cache: "no-store" });
  if (!imageResponse.ok || !imageResponse.body) {
    return NextResponse.json({ error: "Could not download image." }, { status: 502 });
  }

  return new NextResponse(imageResponse.body, {
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": imageResponse.headers.get("content-type") ?? "application/octet-stream",
      "Cache-Control": "no-store",
    },
  });
}
