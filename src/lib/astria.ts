import { collectAstriaImageUrls } from "@/lib/astria-images";
import type { GenerationRow } from "@/lib/generations-db";

const ASTRIA_API_KEY = process.env.ASTRIA_API_KEY;
const BASE = "https://api.astria.ai";

/**
 * Typed error for Astria API failures. isRetriable=true means Astria confirmed
 * rejection (4xx) — the tune was never created, auto-retry is safe.
 * isRetriable=false (5xx) means the tune may have been created — treat as
 * ASTRIA_STATUS_UNKNOWN and block automatic retry.
 */
export class AstriaApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly isRetriable: boolean
  ) {
    super(message);
    this.name = "AstriaApiError";
  }
}

/**
 * Thrown for local validation errors that occur before any Astria request is
 * made — confirmed pre-fetch failures where auto-retry is safe once the
 * underlying data is fixed (e.g. unknown style key, bad expectedCount).
 */
export class AstriaValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AstriaValidationError";
  }
}

// 4xx codes treated as pre-processing rejections for POST — isRetriable=true.
// Risk accepted by design: a well-formed API returns these before creating
// resources. If Astria ever contradicts this, the tune will be orphaned.
// 429 excluded: may fire after server starts processing (ambiguous for POST).
const ASTRIA_SAFE_REJECTION_CODES = new Set([400, 401, 403, 422]);

const ALLOWED_INPUT_URL_HOSTNAME = ".blob.vercel-storage.com";

function isPrivateHost(hostname: string): boolean {
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname === "::1" ||
    /^10\./.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname) ||
    /^192\.168\./.test(hostname) ||
    hostname.endsWith(".internal") ||
    hostname.endsWith(".local")
  );
}

function validateInputUrl(url: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new AstriaValidationError(`input_urls contains an invalid URL: ${url}`);
  }
  if (parsed.protocol !== "https:") {
    throw new AstriaValidationError(`input_urls must use https, got: ${url}`);
  }
  if (!parsed.hostname.endsWith(ALLOWED_INPUT_URL_HOSTNAME)) {
    throw new AstriaValidationError(
      `input_urls hostname not allowed (must be *.blob.vercel-storage.com): ${parsed.hostname}`
    );
  }
  if (parsed.username || parsed.password) {
    throw new AstriaValidationError(`input_urls must not contain credentials`);
  }
  if (parsed.port !== "" && parsed.port !== "443") {
    throw new AstriaValidationError(`input_urls must use standard HTTPS port`);
  }
}

function validateCallbackUrl(url: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new AstriaValidationError(`callbackUrl is not a valid URL: ${url}`);
  }
  if (parsed.protocol !== "https:") {
    throw new AstriaValidationError(`callbackUrl must use https: ${url}`);
  }
  // Restrict to our own server origin to prevent Astria from being used as a
  // SSRF proxy (IP allowlist is insufficient against DNS rebinding attacks).
  const rawAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!rawAppUrl) {
    throw new AstriaValidationError("NEXT_PUBLIC_APP_URL env var is not set; cannot validate callbackUrl");
  }
  let trustedOrigin: URL;
  try {
    trustedOrigin = new URL(rawAppUrl);
  } catch {
    throw new AstriaValidationError("NEXT_PUBLIC_APP_URL is not a valid URL");
  }
  if (
    parsed.origin !== trustedOrigin.origin ||
    parsed.username ||
    parsed.password ||
    !(
      parsed.pathname === "/api/webhook/astria" ||
      parsed.pathname.startsWith("/api/webhook/astria/")
    ) ||
    /[%\\]/.test(parsed.pathname)
  ) {
    throw new AstriaValidationError(
      `callbackUrl must be ${trustedOrigin.origin}/api/webhook/astria[...], got: ${url}`
    );
  }
}

const HEADSHOT_CROP_SUFFIX =
  ", tight headshot crop, face and shoulders only, no torso, no waist, close-up portrait framing";
const GLOBAL_NEGATIVE_PROMPT =
  "wrong outfit, same clothes as input, casual wear if not startup style, distorted face, extra limbs, bad anatomy, blurry, low quality, different hairstyle, added hair, receding hairline, beard, facial hair, mustache, bald, changed hair color, swollen face, puffiness";

export const HEADSHOT_STYLES = {
  linkedin: {
    prompt: `OHWX person wearing a crisp light blue oxford shirt, clean neutral gray background, soft professional studio lighting, confident friendly expression, professional LinkedIn headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "t-shirt, hoodie, casual wear, dark clothing, busy background",
  },
  corporate: {
    prompt: `OHWX person wearing a dark navy suit and white dress shirt, clean gray studio background, professional studio lighting, confident business expression, corporate headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "t-shirt, hoodie, casual clothing, colorful background",
  },
  executive: {
    prompt: `OHWX person wearing a charcoal suit and white dress shirt, dark neutral backdrop, dramatic Rembrandt studio lighting, authoritative professional expression, executive headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "t-shirt, casual wear, bright background, informal clothing",
  },
  tech: {
    prompt: `OHWX person wearing a dark navy button-up shirt, modern minimal office with subtle window light, confident approachable expression, tech professional headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "suit, tie, casual t-shirt, hoodie, messy background",
  },
  creative: {
    prompt: `OHWX person wearing a smart casual blazer over a white shirt, warm bokeh background with golden atmospheric light, relaxed creative expression, editorial headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "t-shirt, formal suit, dark background, casual clothing",
  },
  startup: {
    prompt: `OHWX person wearing a clean white premium t-shirt or minimal hoodie, pure white studio background, natural soft lighting, relaxed confident founder expression, startup headshot${HEADSHOT_CROP_SUFFIX}`,
    negative: "suit, tie, formal wear, dark background, busy background",
  },
} as const;

export type HeadshotStyle = keyof typeof HEADSHOT_STYLES;
export const IMAGES_PER_STYLE = 3;
const STYLE_KEYS = Object.keys(HEADSHOT_STYLES) as HeadshotStyle[];
export const EXPECTED_HEADSHOT_COUNT = STYLE_KEYS.length * IMAGES_PER_STYLE;

export const VALID_STYLE_KEYS: ReadonlySet<string> = new Set(STYLE_KEYS);

function buildStylePrompt(style: (typeof HEADSHOT_STYLES)[HeadshotStyle]): string {
  return [
    "Same hairstyle and facial features as in the reference photos. Do not add or remove hair.",
    style.prompt,
    "The outfit must match this style exactly and should not copy the clothing from the input selfies.",
    `Avoid: ${style.negative}, ${GLOBAL_NEGATIVE_PROMPT}.`,
  ].join(" ");
}

function getAstriaApiKey(): string {
  if (!ASTRIA_API_KEY) {
    throw new AstriaValidationError("ASTRIA_API_KEY is not configured");
  }
  return ASTRIA_API_KEY;
}

async function parseAstriaResponse(res: Response): Promise<any> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const details = data ? `: ${JSON.stringify(data)}` : "";
    const message =
      (typeof data?.message === "string" ? data.message : null) ??
      (typeof data?.error === "string" ? data.error : null) ??
      `Astria API request failed with status ${res.status}${details}`;
    throw new AstriaApiError(
      message,
      res.status,
      ASTRIA_SAFE_REJECTION_CODES.has(res.status)
    );
  }
  return data;
}

function resolveStyleKeys(keys: string[]): HeadshotStyle[] {
  const unique = Array.from(new Set(keys));
  if (unique.length === 0) {
    throw new AstriaValidationError("No style keys provided.");
  }
  const invalid = unique.filter((k) => !VALID_STYLE_KEYS.has(k));
  if (invalid.length > 0) {
    throw new AstriaValidationError(
      `Unknown style keys: ${invalid.join(", ")}. Valid: ${STYLE_KEYS.join(", ")}`
    );
  }
  return unique as HeadshotStyle[];
}

export async function createAstrinaTune(
  generation: Pick<
    GenerationRow,
    | "input_urls"
    | "style_keys"
    | "expected_count"
    | "super_resolution"
    | "inference_steps"
    | "training_steps"
  >,
  callbackUrl: string
): Promise<string> {
  const count = generation.expected_count;
  if (!Number.isSafeInteger(count) || count <= 0 || count > 200) {
    throw new AstriaValidationError(
      `expected_count must be a positive integer ≤ 200, got: ${count}`
    );
  }
  if (!Array.isArray(generation.style_keys)) {
    throw new AstriaValidationError("style_keys must be an array");
  }
  if (!Array.isArray(generation.input_urls) || generation.input_urls.length === 0) {
    throw new AstriaValidationError("input_urls must be a non-empty array");
  }
  for (const url of generation.input_urls) {
    if (typeof url !== "string") {
      throw new AstriaValidationError(`input_urls must contain strings, got: ${typeof url}`);
    }
    validateInputUrl(url);
  }
  const ts = generation.training_steps;
  if (ts !== null && ts !== undefined && (!Number.isSafeInteger(ts) || ts <= 0 || ts > 3000)) {
    throw new AstriaValidationError(`training_steps must be a positive integer ≤ 3000, got: ${ts}`);
  }
  const is = generation.inference_steps;
  if (is !== null && is !== undefined && (!Number.isSafeInteger(is) || is <= 0 || is > 150)) {
    throw new AstriaValidationError(`inference_steps must be a positive integer ≤ 150, got: ${is}`);
  }
  const styleKeys = resolveStyleKeys(generation.style_keys);
  if (count % styleKeys.length !== 0) {
    throw new AstriaValidationError(
      `expected_count (${count}) must be divisible by the number of styles (${styleKeys.length})`
    );
  }
  const imagesPerStyle = count / styleKeys.length;

  validateCallbackUrl(callbackUrl);
  if (typeof generation.super_resolution !== "boolean") {
    throw new AstriaValidationError(
      `super_resolution must be a boolean, got: ${typeof generation.super_resolution}`
    );
  }

  const body = {
    tune: {
      title: "headshot-user",
      name: "person",
      base_tune_id: 1504944,
      model_type: "lora",
      token: "OHWX",
      preset: "flux-lora-portrait",
      face_detection: true,
      steps: generation.training_steps || 500,
      image_urls: generation.input_urls,
      callback: callbackUrl,
      prompts_attributes: styleKeys.map((key) => ({
        text: buildStylePrompt(HEADSHOT_STYLES[key]),
        callback: callbackUrl,
        num_images: imagesPerStyle,
        w: 640,
        h: 768,
        super_resolution: generation.super_resolution,
        face_correct: true,
        steps: generation.inference_steps || 30,
      })),
    },
  };

  const apiKey = getAstriaApiKey();
  let res: Response;
  try {
    res = await fetch(`${BASE}/tunes`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(60_000),
    });
  } catch (err) {
    // Network error or timeout after the request may have reached Astria — tune
    // status is unknown; block auto-retry to avoid duplicate creation/billing.
    throw new AstriaApiError(
      `ASTRIA_STATUS_UNKNOWN: network error during tune creation: ${err instanceof Error ? err.message : String(err)}`,
      0,
      false
    );
  }
  const data = await parseAstriaResponse(res);

  const rawId = data?.id;
  if (typeof rawId !== "string" && typeof rawId !== "number") {
    // POST succeeded but no id returned — tune may have been created; block retry.
    throw new AstriaApiError(
      "ASTRIA_STATUS_UNKNOWN: Astria tune creation returned no tune id",
      res.status,
      false
    );
  }
  const tuneId = String(rawId);
  if (!/^\d+$/.test(tuneId)) {
    throw new AstriaApiError(
      `ASTRIA_STATUS_UNKNOWN: Astria tune id has unexpected format: ${tuneId}`,
      res.status,
      false
    );
  }

  return tuneId;
}

export async function fetchTuneOutputUrls(tuneId: string): Promise<string[]> {
  if (!/^\d+$/.test(tuneId)) {
    throw new AstriaValidationError(`Invalid tuneId format: ${tuneId}`);
  }
  const apiKey = getAstriaApiKey();
  let res: Response;
  try {
    res = await fetch(`${BASE}/tunes/${encodeURIComponent(tuneId)}/prompts`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    // GET is idempotent — network errors and timeouts are safe to retry.
    throw new AstriaApiError(
      `Network error fetching tune outputs: ${err instanceof Error ? err.message : String(err)}`,
      0,
      true
    );
  }

  const data = await (async () => {
    const raw = await res.json().catch(() => null);
    if (!res.ok) {
      const details = raw ? `: ${JSON.stringify(raw)}` : "";
      const message =
        (typeof raw?.message === "string" ? raw.message : null) ??
        (typeof raw?.error === "string" ? raw.error : null) ??
        `Astria prompts request failed with status ${res.status}${details}`;
      // GET: 5xx and 429 are retriable; 4xx are permanent.
      throw new AstriaApiError(message, res.status, res.status === 429 || res.status >= 500);
    }
    return raw;
  })();

  if (!Array.isArray(data)) {
    throw new AstriaApiError(
      `Unexpected response format from Astria prompts endpoint (expected array, got ${typeof data})`,
      res.status,
      true
    );
  }

  const urls = data.flatMap((prompt) => collectAstriaImageUrls(prompt));
  return Array.from(new Set(urls));
}
