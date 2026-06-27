import { NextRequest, NextResponse } from "next/server";

import { esc, notifyOperator } from "@/lib/notify";

export const runtime = "nodejs";

/**
 * Client-side funnel tracking → fire-and-forget Telegram alerts to the operator.
 * Hardened against spam/abuse: hard allowlist of events, body size cap, string-only
 * props with length clamping + HTML escaping. ANY parse/validation failure returns
 * 200 with no notification (silent ignore) so the client never sees an error.
 */

/** Only these events ever notify; anything else is silently dropped. */
const ALLOWED_EVENTS = new Set(["site_visit", "upload_started", "checkout_opened"]);

const MAX_BODY_BYTES = 2048;
const MAX_PROP_LEN = 100;

/** Coerce to a clamped, HTML-escaped string, or null if not a usable string. */
function cleanProp(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const trimmed = v.trim();
  if (!trimmed) return null;
  return esc(trimmed.slice(0, MAX_PROP_LEN));
}

/**
 * Read the request body but never buffer more than `maxBytes`. Returns the
 * decoded string, or null if the body exceeds the cap (caller drops the request)
 * or there is no readable body. Streaming so an oversized/chunked body can't be
 * fully held in memory before the size check.
 */
async function readBodyCapped(req: NextRequest, maxBytes: number): Promise<string | null> {
  const body = req.body;
  if (!body) {
    // No stream (e.g. empty body) — fall back to the framework reader; whatever
    // it returns is, by definition, already within a small bound here.
    const raw = await req.text();
    return new TextEncoder().encode(raw).length > maxBytes ? null : raw;
  }
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        total += value.byteLength;
        if (total > maxBytes) {
          await reader.cancel().catch(() => {});
          return null;
        }
        chunks.push(value);
      }
    }
  } finally {
    reader.releaseLock();
  }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(merged);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Size cap: reject oversized bodies BEFORE buffering them in memory.
    // Public endpoint → DoS guard. Fire-and-forget: 200, no processing.
    // 1) Cheap pre-check on Content-Length when present/honest.
    const contentLength = req.headers.get("content-length");
    if (contentLength) {
      const declaredBytes = Number(contentLength);
      if (Number.isFinite(declaredBytes) && declaredBytes > MAX_BODY_BYTES) {
        return NextResponse.json({ ok: true });
      }
    }

    // 2) Hard cap while reading: stop the moment we exceed MAX_BODY_BYTES so a
    // chunked body with no/spoofed Content-Length can't be buffered unbounded.
    const raw = await readBodyCapped(req, MAX_BODY_BYTES);
    if (raw === null) {
      return NextResponse.json({ ok: true });
    }

    const body = raw ? (JSON.parse(raw) as unknown) : {};
    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ ok: true });
    }

    const { event, props } = body as { event?: unknown; props?: unknown };
    if (typeof event !== "string" || !ALLOWED_EVENTS.has(event)) {
      // Unknown/abusive event → 200, no notification.
      return NextResponse.json({ ok: true });
    }

    const p: Record<string, string | null> = {};
    if (typeof props === "object" && props !== null) {
      for (const [key, value] of Object.entries(props as Record<string, unknown>)) {
        p[key] = cleanProp(value);
      }
    }

    let text: string;
    switch (event) {
      case "site_visit": {
        text = "👀 Заход на сайт";
        if (p.path) text += `\nСтраница: ${p.path}`;
        break;
      }
      case "upload_started": {
        text = "📤 Клиент начал загрузку селфи";
        break;
      }
      case "checkout_opened": {
        text = "🛒 Клиент открыл оплату";
        if (p.tier) text += `\nТариф: ${p.tier}`;
        break;
      }
      default:
        return NextResponse.json({ ok: true });
    }

    // Fire-and-forget by design: notifyOperator returns void and contains its
    // own async send + error handling internally (never throws, never rejects).
    notifyOperator(text);
  } catch {
    // Parse error, bad JSON, anything — swallow it. Fire-and-forget semantics.
  }
  return NextResponse.json({ ok: true });
}
