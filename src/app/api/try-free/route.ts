import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

import {
  createGeneration,
  findRateLimitedGeneration,
  updateGenerationStatus,
} from "@/lib/generations-db";
import {
  STYLE_PROMPTS,
  type HeadshotStyle,
  generateHeadshotsWithPulid,
  uploadReferencePhoto,
} from "@/lib/fal";
import { sendHeadshotsReady, sendHeadshotsStarted } from "@/lib/email";

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

async function persistToBlob(url: string, id: string, index: number): Promise<string> {
  try {
    const res = await fetch(url);
    if (!res.ok) return url;

    const blob = await res.blob();
    const { url: blobUrl } = await put(`headshots/${id}/${index}.jpg`, blob, {
      access: "public",
      contentType: "image/jpeg",
    });

    return blobUrl;
  } catch {
    return url;
  }
}

export async function POST(request: Request) {
  console.log("try-free called");
  console.log("env APP_URL:", process.env.NEXT_PUBLIC_APP_URL);

  try {
    const form = await request.formData();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const files = form.getAll("photos").filter((value): value is File => value instanceof File);

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Enter a valid email address" }, { status: 400 });
    }

    if (files.length < 3 || files.length > 20) {
      return NextResponse.json(
        { error: "Upload 3-20 selfies." },
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
      const referenceUrl = await uploadReferencePhoto(files[0]);
      const styles = Object.keys(STYLE_PROMPTS) as HeadshotStyle[];
      const tasks = styles.flatMap((style) =>
        Array.from({ length: 3 }, () => generateHeadshotsWithPulid(referenceUrl, style))
      );
      const settled = await Promise.allSettled(tasks);
      const rawUrls = settled
        .filter((result): result is PromiseFulfilledResult<string> => result.status === "fulfilled")
        .map((result) => result.value);

      if (rawUrls.length === 0) {
        const errors = settled
          .filter((result): result is PromiseRejectedResult => result.status === "rejected")
          .map((result) => (result.reason instanceof Error ? result.reason.message : String(result.reason)));
        throw new Error(errors[0] ?? "fal.ai returned no generated images.");
      }

      const outputUrls = await Promise.all(
        rawUrls.map((url, index) => persistToBlob(url, generation.id, index))
      );
      const completedGeneration = await updateGenerationStatus({
        id: generation.id,
        status: "done",
        outputUrls,
      });

      try {
        await sendHeadshotsReady(
          completedGeneration.email,
          `/try/result/${completedGeneration.id}`,
          completedGeneration.output_urls
        );
      } catch (error) {
        console.error("headshots-ready email failed:", error);
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown fal generation error";
      await updateGenerationStatus({
        id: generation.id,
        status: "failed",
        errorMessage: message,
      });
      return NextResponse.json({ error: `fal generation failed: ${message}` }, { status: 500 });
    }

    return NextResponse.json({ id: generation.id });
  } catch (err) {
    console.error("try-free error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
