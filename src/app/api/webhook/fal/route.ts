import {
  generateHeadshots,
  getLoraPathFromTrainingResult,
  isFreeHeadshotStyle,
} from "@/lib/fal";
import { updateGenerationStatus } from "@/lib/generations-db";

export const runtime = "nodejs";
export const maxDuration = 120;

type FalWebhookBody = {
  status?: "OK" | "ERROR" | string;
  error?: string;
  payload?: unknown;
  data?: unknown;
};

export async function POST(request: Request) {
  const url = new URL(request.url);
  const generationId = url.searchParams.get("id");
  const styleParam = url.searchParams.get("style");

  if (!generationId) {
    return Response.json({ error: "Missing generation id" }, { status: 400 });
  }

  let body: FalWebhookBody;
  try {
    body = (await request.json()) as FalWebhookBody;
  } catch {
    await updateGenerationStatus({ id: generationId, status: "failed" });
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (body.status === "ERROR") {
    await updateGenerationStatus({ id: generationId, status: "failed" });
    return Response.json({ ok: true });
  }

  const loraPath =
    getLoraPathFromTrainingResult(body.payload) ?? getLoraPathFromTrainingResult(body.data);

  if (!loraPath) {
    await updateGenerationStatus({ id: generationId, status: "failed" });
    return Response.json({ error: "Missing LoRA file in fal webhook payload" }, { status: 400 });
  }

  try {
    const style = isFreeHeadshotStyle(styleParam) ? styleParam : "linkedin";
    const outputUrls = await generateHeadshots(loraPath, style);
    await updateGenerationStatus({
      id: generationId,
      status: "done",
      outputUrls,
    });
    return Response.json({ ok: true });
  } catch (error) {
    await updateGenerationStatus({ id: generationId, status: "failed" });
    return Response.json(
      { error: error instanceof Error ? error.message : "Generation failed" },
      { status: 500 }
    );
  }
}
