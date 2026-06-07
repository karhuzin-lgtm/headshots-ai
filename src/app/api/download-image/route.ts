import { NextResponse } from "next/server";

/** Max image we'll proxy. Astria portraits are well under this. */
const MAX_BYTES = 25 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 15_000;
const MAX_REDIRECTS = 4;

/**
 * Hostname allowlist for the download proxy. Only the result hosts we actually
 * serve from. An allowlist (vs. a deny-pattern) closes SSRF via DNS-rebinding
 * AND via redirect — an attacker can't point one of these domains at an internal
 * IP, and every redirect hop is re-checked against the same list.
 */
const ALLOWED_HOST_SUFFIXES = [
  ".amazonaws.com", // Astria S3 (sdbooth2-production.s3.amazonaws.com)
  ".astria.ai",
  ".cloudfront.net",
  ".blob.vercel-storage.com", // Vercel Blob (our uploads)
];

function sanitizeFilename(filename: string | null): string {
  const fallback = "portrait.jpg";
  if (!filename) return fallback;
  return filename.replace(/[^a-z0-9._-]/gi, "-") || fallback;
}

function isAllowedImageUrl(url: URL): boolean {
  if (url.protocol !== "https:") return false;
  if (url.port && url.port !== "443") return false;
  const host = url.hostname.toLowerCase();
  return ALLOWED_HOST_SUFFIXES.some((suffix) => host.endsWith(suffix));
}

/** Follow redirects manually, re-validating every hop against the allowlist. */
async function fetchImageSafely(start: URL): Promise<Response> {
  let current = start;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (!isAllowedImageUrl(current)) {
      throw new Error("blocked-host");
    }
    const res = await fetch(current, {
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) return res;
      current = new URL(location, current);
      continue;
    }
    return res;
  }
  throw new Error("too-many-redirects");
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

  if (!isAllowedImageUrl(url)) {
    return NextResponse.json({ error: "Unsupported image URL." }, { status: 400 });
  }

  let imageResponse: Response;
  try {
    imageResponse = await fetchImageSafely(url);
  } catch {
    return NextResponse.json({ error: "Could not download image." }, { status: 502 });
  }

  if (!imageResponse.ok || !imageResponse.body) {
    return NextResponse.json({ error: "Could not download image." }, { status: 502 });
  }

  const contentType = imageResponse.headers.get("content-type") ?? "";
  if (!contentType.startsWith("image/")) {
    return NextResponse.json({ error: "Not an image." }, { status: 400 });
  }

  const declaredSize = Number(imageResponse.headers.get("content-length") ?? "0");
  if (declaredSize && declaredSize > MAX_BYTES) {
    return NextResponse.json({ error: "Image too large." }, { status: 413 });
  }

  return new NextResponse(imageResponse.body, {
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": contentType || "application/octet-stream",
      "Cache-Control": "no-store",
    },
  });
}
