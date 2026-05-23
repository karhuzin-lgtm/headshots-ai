import { NextResponse } from "next/server";

import {
  createGeneration,
  findRateLimitedGeneration,
  updateGenerationStatus,
} from "@/lib/generations-db";
import { createAstrinaTune } from "@/lib/astria";
import { sendHeadshotsStarted } from "@/lib/email";

export const runtime = "nodejs";
export const maxDuration = 300;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidPhotoUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return false;
    return (
      parsed.hostname.endsWith(".public.blob.vercel-storage.com") ||
      parsed.hostname.endsWith(".blob.vercel-storage.com")
    );
  } catch {
    return false;
  }
}

export async function GET() {
  return NextResponse.json(
    { error: "Use POST with email and photoUrls to start a free generation." },
    { status: 405 }
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: unknown; photoUrls?: unknown };
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const photoUrls = Array.isArray(body.photoUrls)
      ? body.photoUrls.filter((url): url is string => typeof url === "string")
      : [];

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }

    if (photoUrls.length < 8 || photoUrls.length > 20) {
      return NextResponse.json(
        { error: "Upload at least 8 selfies." },
        { status: 400 }
      );
    }

    if (!photoUrls.every(isValidPhotoUrl)) {
      return NextResponse.json({ error: "Invalid photo URLs." }, { status: 400 });
    }

    const existingGeneration = await findRateLimitedGeneration(email);
    if (existingGeneration) {
      return NextResponse.json(
        { error: "You already have a free generation. Check your email for results." },
        { status: 429 }
      );
    }

    const inputUrls = photoUrls;

    const generation = await createGeneration({ email, inputUrls });
    try {
      await sendHeadshotsStarted(email, `/try/result/${generation.id}`);
    } catch (error) {
      console.error("headshots-started email failed:", error);
    }

    try {
      await updateGenerationStatus({ id: generation.id, status: "processing" });
      const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://headshots.alekseimedia.com").replace(
        /\/$/,
        ""
      );
      const callbackUrl = `${appUrl}/api/webhook/astria?generationId=${encodeURIComponent(generation.id)}`;
      const tuneId = await createAstrinaTune(inputUrls, callbackUrl);
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
