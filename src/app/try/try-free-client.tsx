"use client";

import { upload } from "@vercel/blob/client";
import { CheckCircle2, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";

import {
  emptyWaitlistConsent,
  isPhotoConsentValid,
  PhotoProcessingConsentFields,
  type LegalConsentState,
} from "@/components/legal/legal-consent-fields";
import { DISPLAY_STYLES } from "@/lib/display-styles";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TIPS_GOOD = [
  "Good lighting — face clearly visible, not backlit",
  "Different angles: front, slight left, slight right",
  "Different expressions: smile, neutral, serious",
  "2–3 different outfits across your photos",
  "Photos from the last 6 months — recent look only",
];

const TIPS_BAD = [
  "No sunglasses, hats, or face coverings",
  "No group photos — only you in the frame",
  "No heavy filters or beauty mode",
  "No photos when you look visibly tired, sick, or swollen",
];

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDim = 1024;
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      canvas.width = w;
      canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          resolve(new File([blob!], file.name, { type: "image/jpeg" }));
          URL.revokeObjectURL(url);
        },
        "image/jpeg",
        0.72
      );
    };
    img.src = url;
  });
}

function StylePreviewStrip() {
  return (
    <div className="flex justify-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {DISPLAY_STYLES.map((style) => (
        <div
          key={style.key}
          className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg ring-1 ring-gray-200/80"
          title={style.name}
        >
          <Image
            src={style.photo}
            alt=""
            width={44}
            height={56}
            className="h-full w-full object-cover object-top"
            sizes="44px"
          />
        </div>
      ))}
    </div>
  );
}

export function TryFreeClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [consent, setConsent] = useState<LegalConsentState>(emptyWaitlistConsent);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  function addFiles(incoming: File[]) {
    setFiles((prev) => [...prev, ...incoming].slice(0, 20));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_RE.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!isPhotoConsentValid(consent)) {
      setError("Please confirm age, accept the policies, and consent to photo processing.");
      return;
    }

    if (files.length < 8 || files.length > 20) {
      setError("Upload at least 8 selfies for best results.");
      return;
    }

    setLoading(true);
    setUploadProgress(null);
    try {
      const compressed = await Promise.all(files.map(compressImage));
      const photoUrls: string[] = [];

      for (let i = 0; i < compressed.length; i++) {
        setUploadProgress(`Uploading photo ${i + 1} of ${compressed.length}…`);
        const file = compressed[i];
        const pathname = `try-free/${crypto.randomUUID()}.jpg`;
        const blob = await upload(pathname, file, {
          access: "public",
          handleUploadUrl: "/api/try-free/upload",
          contentType: "image/jpeg",
        });
        photoUrls.push(blob.url);
      }

      setUploadProgress("Starting generation…");

      const res = await fetch("/api/try-free", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, photoUrls }),
      });
      const text = await res.text();
      let json: { id?: string; error?: string } = {};
      try {
        json = text ? (JSON.parse(text) as { id?: string; error?: string }) : {};
      } catch {
        json = { error: text };
      }
      if (!res.ok || !json.id) {
        throw new Error(json.error || text || "Could not start generation.");
      }
      setEmail(normalizedEmail);
      setGenerationId(json.id);
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start generation.");
    } finally {
      setLoading(false);
      setUploadProgress(null);
    }
  }

  if (success) {
    return (
      <div className="relative mx-auto flex min-h-[50vh] max-w-lg items-center justify-center px-5 pb-20">
        <div className="w-full rounded-2xl border border-gray-200/80 bg-white p-8 text-center shadow-lg sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 className="h-7 w-7 text-emerald-600" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-normal tracking-tight text-[#111827] sm:text-3xl">
            You&apos;re all set
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">
            Your model is training now. We&apos;ll email{" "}
            <span className="font-medium text-gray-900">{email}</span> with 18 headshots across 6 styles in ~20
            minutes.
          </p>
          <ul className="mt-6 space-y-2 rounded-xl border border-gray-100 bg-[#faf8f5] p-4 text-left text-sm text-gray-600">
            <li className="flex gap-2">
              <span className="text-[#c9a96e]">✓</span> 6 styles × 3 photos each (18 total)
            </li>
            <li className="flex gap-2">
              <span className="text-[#c9a96e]">✓</span> Check your inbox in ~20 minutes
            </li>
            <li className="flex gap-2">
              <span className="text-[#c9a96e]">✓</span> Check spam if nothing arrives
            </li>
          </ul>
          {generationId && (
            <a
              href={`/try/result/${generationId}`}
              className="mt-8 inline-flex min-h-[48px] w-full items-center justify-center rounded-full bg-[#111827] px-6 text-sm font-semibold text-white transition hover:bg-black"
            >
              View status &amp; download
            </a>
          )}
          <p className="mt-4 text-xs text-gray-400">You can safely close this tab.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-2xl px-5 pb-20 sm:px-6">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg sm:p-8"
      >
        <div>
          <label htmlFor="try-email" className="text-sm font-semibold text-[#111827]">
            Email address
          </label>
          <input
            id="try-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@company.com"
            className="mt-2 min-h-[52px] w-full rounded-xl border border-gray-200 bg-white px-4 text-base text-[#111827] outline-none transition placeholder:text-gray-400 focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/10"
          />
          <p className="mt-2 text-xs text-gray-500">We&apos;ll email your results when they&apos;re ready.</p>
        </div>

        <div className="mt-8 rounded-xl border border-[#c9a96e]/20 bg-[#faf8f5] p-4">
          <p className="text-sm font-medium text-[#111827]">You&apos;ll receive all 6 professional styles</p>
          <p className="mt-1 text-xs text-gray-500">LinkedIn · Corporate · Executive · Tech · Creative · Startup</p>
          <div className="mt-4">
            <StylePreviewStrip />
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold text-[#111827]">Tips for best results</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {TIPS_GOOD.map((text) => (
              <li key={text} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="mt-0.5 font-bold text-[#c9a96e]">✓</span>
                {text}
              </li>
            ))}
            {TIPS_BAD.map((text) => (
              <li key={text} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="mt-0.5 font-bold text-red-500">✗</span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <label className="text-sm font-semibold text-[#111827]">
            Selfies
            <span className="ml-2 font-normal text-gray-500">8–20 photos</span>
          </label>
          <label
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files?.length) addFiles(Array.from(e.dataTransfer.files));
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            className={cn(
              "mt-3 flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition",
              isDragging
                ? "border-[#c9a96e]/60 bg-[#faf8f5]"
                : "border-gray-200 bg-[#faf8f5] hover:border-[#c9a96e]/40 hover:bg-white"
            )}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-700 shadow-sm ring-1 ring-gray-100">
              <Upload className="h-5 w-5" aria-hidden />
            </span>
            <span className="mt-4 text-sm font-medium text-gray-900">Drag & drop or click to browse</span>
            <span className="mt-1 text-xs text-gray-500">JPG, PNG, WebP, HEIC · max 20 files</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              multiple
              className="sr-only"
              onChange={(event) => {
                if (event.target.files?.length) addFiles(Array.from(event.target.files));
                event.target.value = "";
              }}
            />
          </label>

          {files.length > 0 && (
            <div className="mt-4">
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                {previews.map((url, idx) => (
                  <div
                    key={url}
                    className="group relative aspect-square overflow-hidden rounded-lg ring-1 ring-gray-200/80"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs text-white opacity-0 transition group-hover:opacity-100"
                      aria-label="Remove photo"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex min-h-[40px] items-center rounded-full border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
                >
                  + Add more
                </button>
                <p className="text-xs text-gray-500">
                  {files.length}/20 selected
                  {files.length < 8 && (
                    <span className="text-[#9a7b4f]"> · need {8 - files.length} more</span>
                  )}
                </p>
              </div>
            </div>
          )}
        </div>

        <PhotoProcessingConsentFields value={consent} onChange={setConsent} className="mt-8" />

        <button
          type="submit"
          disabled={loading || !isPhotoConsentValid(consent)}
          className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#111827] text-base font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {uploadProgress ?? "Creating your headshots…"}
            </>
          ) : (
            "Generate my headshots"
          )}
        </button>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
