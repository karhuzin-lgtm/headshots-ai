import { put } from "@vercel/blob";

import {
  STYLE_PROMPTS,
  generateHeadshots,
  getLoraPathFromTrainingResult,
} from "@/lib/fal";
import { updateGenerationStatus } from "@/lib/generations-db";
import { sendHeadshotsReady } from "@/lib/email";

export const runtime = "nodejs";
export const maxDuration = 120;

type FalWebhookBody = {
  status?: "OK" | "ERROR" | string;
  error?: string;
  payload?: unknown;
  data?: unknown;
};

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
  const url = new URL(request.url);
  const generationId = url.searchParams.get("id");
  const styleParam = url.searchParams.get("style");
  console.log("[webhook] received", { generationId, style: styleParam });

  if (!generationId) {
    return Response.json({ error: "Missing generation id" }, { status: 400 });
  }

  let body: FalWebhookBody;
  try {
    body = (await request.json()) as FalWebhookBody;
    console.log("[webhook] full body", JSON.stringify(body, null, 2));
  } catch (error) {
    console.error("[webhook] error", error);
    await updateGenerationStatus({
      id: generationId,
      status: "failed",
      errorMessage: "Invalid fal webhook JSON",
    });
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.status === "ERROR") {
    console.error("[webhook] error", body.error ?? "fal training failed");
    await updateGenerationStatus({
      id: generationId,
      status: "failed",
      errorMessage: body.error ?? "fal training failed",
    });
    return Response.json({ ok: true });
  }

  const loraPath =
    getLoraPathFromTrainingResult(body.payload) ?? getLoraPathFromTrainingResult(body.data);
  console.log("[webhook] loraPath", loraPath);

  if (!loraPath) {
    console.error("[webhook] error", "Missing LoRA file in fal webhook payload");
    await updateGenerationStatus({
      id: generationId,
      status: "failed",
      errorMessage: "Missing LoRA file in fal webhook payload",
    });
    return Response.json({ error: "Missing LoRA file in fal webhook payload" }, { status: 400 });
  }

  try {
    const allStyles = Object.keys(STYLE_PROMPTS) as (keyof typeof STYLE_PROMPTS)[];
    const allRawUrls = await Promise.all(
      allStyles.map((s) => generateHeadshots(loraPath, s))
    );
    const rawUrls = allRawUrls.flat();
    const outputUrls = await Promise.all(
      rawUrls.map((url, i) => persistToBlob(url, generationId, i))
    );
    console.log("[webhook] outputUrls", outputUrls);
    const generation = await updateGenerationStatus({
      id: generationId,
      status: "done",
      outputUrls,
    });
    console.log("[webhook] status updated to done");

    try {
      await sendHeadshotsReady(
        generation.email,
        `/try/result/${generation.id}`,
        generation.output_urls
      );
    } catch (error) {
      console.error("[webhook] error", error);
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error("[webhook] error", error);
    await updateGenerationStatus({
      id: generationId,
      status: "failed",
      errorMessage: error instanceof Error ? error.message : "Generation failed",
    });
    return Response.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
