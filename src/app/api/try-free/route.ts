import { NextResponse } from "next/server";
import { put } from "@vercel/blob";

import { readWaitlist } from "@/lib/free-generation-store";
import { createGeneration, updateGenerationStatus } from "@/lib/generations-db";
import {
  createTrainingZip,
  isFreeHeadshotStyle,
  trainLoRA,
} from "@/lib/fal";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET() {
  return NextResponse.json(
    { error: "Use POST with email and photos to start a free generation." },
    { status: 405 }
  );
}

function isImage(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    file.type.startsWith("image/") ||
    /\.(jpe?g|png|webp|heic|heif)$/.test(name)
  );
}

function blobPath(file: File, index: number): string {
  const extension = file.name.toLowerCase().match(/\.(jpe?g|png|webp|heic|heif)$/)?.[1] ?? "jpg";
  return `try-free/${crypto.randomUUID()}-${index + 1}.${extension}`;
}

function webhookUrl(generationId: string, style: string): string {
  const params = new URLSearchParams({ id: generationId, style });
  return `https://headshots.alekseimedia.com/api/webhook/fal?${params.toString()}`;
}

export async function POST(request: Request) {
  console.log("try-free called");
  console.log("env APP_URL:", process.env.NEXT_PUBLIC_APP_URL);

  try {
    const form = await request.formData();
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const style = String(form.get("style") ?? "");
    const files = form.getAll("photos").filter((value): value is File => value instanceof File);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (!isFreeHeadshotStyle(style)) {
      return NextResponse.json({ error: "Choose a headshot style" }, { status: 400 });
    }

    if (files.length < 3 || files.length > 20) {
      return NextResponse.json(
        { error: "Upload 3-20 selfies. For best results, use 10 or more." },
        { status: 400 }
      );
    }

    if (files.some((file) => !isImage(file))) {
      return NextResponse.json({ error: "Only image files are allowed" }, { status: 400 });
    }

    const waitlist = await readWaitlist();
    const onList = waitlist.some((entry) => entry.email.toLowerCase() === email);
    // On Vercel /tmp is ephemeral and can be different per function instance.
    // If the email comes from /try?email=..., allow the flow even if /tmp lost the signup.
    if (!onList) {
      console.warn(`Proceeding without /tmp waitlist match for ${email}`);
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
      await updateGenerationStatus({ id: generation.id, status: "processing" });
      const trainingZip = await createTrainingZip(files);
      const archive = await put(`try-free/${generation.id}/training.zip`, trainingZip, {
        access: "public",
        contentType: "application/zip",
      });
      await trainLoRA({
        imagesDataUrl: archive.url,
        webhookUrl: webhookUrl(generation.id, style),
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown fal training error";
      await updateGenerationStatus({ id: generation.id, status: "failed" });
      return NextResponse.json({ error: `fal training failed: ${message}` }, { status: 500 });
    }

    return NextResponse.json({ id: generation.id });
  } catch (err) {
    console.error("try-free error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
