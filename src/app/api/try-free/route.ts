import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

import {
  createGeneration,
  findRateLimitedGeneration,
  updateGenerationStatus,
} from "@/lib/generations-db";
import {
  createAstrinaTune,
  HEADSHOT_STYLES,
  type HeadshotStyle,
} from "@/lib/astria";
import { sendHeadshotsStarted } from "@/lib/email";

export const runtime = "nodejs";
export const maxDuration = 300;
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export async function GET() {
  return NextResponse.json(
    { error: "Use POST with email and photos to start a free generation." },
    { status: 405 }
  );
}

function isImage(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    ALLOWED_IMAGE_TYPES.has(file.type) ||
    /\.(jpe?g|png|webp|heic|heif)$/.test(name)
  );
}

function blobPath(file: File, index: number): string {
  const extension = file.name.toLowerCase().match(/\.(jpe?g|png|webp|heic|heif)$/)?.[1] ?? "jpg";
  return `try-free/${crypto.randomUUID()}-${index + 1}.${extension}`;
}

export async function POST(request: Request) {
  console.log("try-free called");
  console.log("env APP_URL:", process.env.NEXT_PUBLIC_APP_URL);

  try {
    const form = await request.formData();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const style = String(form.get("style") ?? "");
    const files = form.getAll("photos").filter((value): value is File => value instanceof File);

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }

    if (!(style in HEADSHOT_STYLES)) {
      return NextResponse.json({ error: "Select a valid headshot style." }, { status: 400 });
    }

    if (files.length < 8 || files.length > 20) {
      return NextResponse.json(
        { error: "Upload at least 8 selfies." },
        { status: 400 }
      );
    }

    if (files.some((file) => !isImage(file))) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      return NextResponse.json(
        { error: "Each image must be 10MB or less" },
        { status: 400 }
      );
    }

    const existingGeneration = await findRateLimitedGeneration(email);
    if (existingGeneration) {
      return NextResponse.json(
        { error: "You already have a free generation. Check your email for results." },
        { status: 429 }
      );
    }

    let inputUrls: string[];
    try {
      const uploaded = await Promise.all(
        files.map((file, index) =>
          put(blobPath(file, index), file, {
            access: "public",
            contentType: file.type || "image/jpeg",
          })
        )
      );
      inputUrls = uploaded.map((blob) => blob.url);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown blob upload error";
      return NextResponse.json({ error: `blob upload failed: ${message}` }, { status: 500 });
    }

    const generation = await createGeneration({ email, inputUrls });
    try {
      await sendHeadshotsStarted(email, `/try/result/${generation.id}`);
    } catch (error) {
      console.error("headshots-started email failed:", error);
    }

    try {
      await updateGenerationStatus({ id: generation.id, status: "processing" });
      const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://headshots.alekseimedia.com").replace(/\/$/, "");
      const callbackUrl = `${appUrl}/api/webhook/astria?generationId=${encodeURIComponent(generation.id)}`;
      const tuneId = await createAstrinaTune(inputUrls, callbackUrl, style as HeadshotStyle);
      await updateGenerationStatus({
        id: generation.id,
        status: "processing",
        tuneId,
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown Astria generation error";
      await updateGenerationStatus({
        id: generation.id,
        status: "failed",
        errorMessage: message,
      });
      return NextResponse.json({ error: `Astria generation failed: ${message}` }, { status: 500 });
    }

    return NextResponse.json({ id: generation.id });
  } catch (err) {
    console.error("try-free error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
