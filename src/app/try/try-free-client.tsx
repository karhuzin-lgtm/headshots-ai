"use client";

import { CheckCircle2, Loader2, Upload } from "lucide-react";
import NextImage from "next/image";
import { FormEvent, useRef, useState } from "react";

import { DISPLAY_STYLES } from "@/lib/display-styles";

const STYLE_OPTIONS = DISPLAY_STYLES;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDim = 1536;
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
        0.85
      );
    };
    img.src = url;
  });
}

export function TryFreeClient() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_RE.test(normalizedEmail)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!selectedStyle) {
      setError("Please select a style");
      return;
    }

    if (files.length < 8 || files.length > 20) {
      setError("Upload at least 8 selfies for best results.");
      return;
    }

    setLoading(true);
    try {
      const form = new FormData();
      form.set("email", normalizedEmail);
      form.set("style", selectedStyle);
      const compressed = await Promise.all(files.map(compressImage));
      compressed.forEach((file) => form.append("photos", file));

      const res = await fetch("/api/try-free", {
        method: "POST",
        body: form,
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
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start generation.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto w-full max-w-3xl px-5 py-16 text-center sm:px-6">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-emerald-500" />
        <h2 className="text-2xl font-semibold text-gray-900">You&apos;re all set!</h2>
        <p className="mx-auto mt-3 max-w-xl text-gray-500">
          Your AI model is training now. We&apos;ll email you at {email} as soon as your headshots are ready (~15 minutes).
        </p>
        <p className="mt-6 text-sm text-gray-400">You can close this tab.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-16 text-center sm:px-5">
      <form onSubmit={onSubmit} className="rounded-3xl border border-[color:var(--border)] bg-white p-5 text-left shadow-sm sm:p-7">
        <div>
          <label htmlFor="try-email" className="block text-sm font-semibold text-foreground">
            Email address
          </label>
          <input
            id="try-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            className="mt-3 min-h-[52px] w-full rounded-xl border border-[#e8e8e8] bg-white px-4 text-[16px] text-[#111] outline-none transition placeholder:text-[#999] focus:border-[#111] focus:ring-2 focus:ring-[#111]/10"
          />
          <p className="mt-2 text-xs text-muted-foreground">
            We&apos;ll use this email to send your results when they&apos;re ready.
          </p>
        </div>

        <div className="mt-7">
          <p className="text-sm font-semibold text-foreground">
            Choose your style
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {STYLE_OPTIONS.map((style) => {
              const isSelected = selectedStyle === style.key;
              return (
                <button
                  key={style.key}
                  type="button"
                  onClick={() => setSelectedStyle(style.key)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setSelectedStyle(style.key);
                    }
                  }}
                  className={`group overflow-hidden rounded-2xl border text-left transition-all duration-300 ${
                    isSelected
                      ? "scale-[1.02] border-primary bg-primary/10 ring-2 ring-white"
                      : "border-[color:var(--border)] bg-[color:var(--bg-3)] hover:scale-[1.02] hover:border-primary/50"
                  } cursor-pointer`}
                  aria-pressed={isSelected}
                  tabIndex={0}
                >
                  <span className="relative block aspect-[3/4] overflow-hidden rounded-t-2xl">
                    <NextImage
                      src={style.photo}
                      alt={`${style.name} style AI headshot example`}
                      width={480}
                      height={600}
                      className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
                    />
                    <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 to-transparent" />
                  </span>
                  <span className="flex items-center justify-between gap-3 p-4 pb-0">
                    <span className="text-base font-semibold text-foreground">{style.name}</span>
                    <span
                      className={`h-3 w-3 rounded-full border ${
                        isSelected ? "border-primary bg-primary" : "border-white/25"
                      }`}
                      aria-hidden
                    />
                  </span>
                  <span className="block px-4 pt-2 text-xs font-medium text-foreground">
                    {style.tagline}
                  </span>
                  <span className="block px-4 pb-4 pt-2 text-xs leading-relaxed text-muted-foreground">
                    {style.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-7">
          <p className="text-sm font-semibold text-foreground">
            Tips for best results
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              { icon: "✓", text: "Good lighting — face clearly visible, not backlit" },
              { icon: "✓", text: "Different angles: front, slight left, slight right" },
              { icon: "✓", text: "Different expressions: smile, neutral, serious" },
              { icon: "✓", text: "2-3 different outfits across your photos" },
              { icon: "✓", text: "Photos from the last 6 months — recent look only" },
              { icon: "✗", text: "No sunglasses, hats, or face coverings" },
              { icon: "✗", text: "No group photos — only you in the frame" },
              { icon: "✗", text: "No heavy filters or beauty mode" },
              { icon: "✗", text: "No photos when you look visibly tired, sick, or swollen" },
            ].map(({ icon, text }) => (
              <li key={text} className="flex items-start gap-2 text-xs text-muted-foreground">
                <span
                  className={
                    icon === "✓"
                      ? "mt-0.5 font-bold text-green-500"
                      : "mt-0.5 font-bold text-red-500"
                  }
                >
                  {icon}
                </span>
                {text}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Better photos = more realistic AI headshots. The model learns from what you upload.
          </p>
        </div>

        <label className="mt-7 block text-sm font-semibold text-foreground">
          Selfies
          <span className="ml-2 font-normal text-muted-foreground">
            Upload 8-20 selfies
          </span>
        </label>
        <label className="mt-3 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[color:var(--border)] bg-[color:var(--bg-3)] px-4 py-8 text-center transition hover:border-primary">
          <Upload className="h-7 w-7 text-muted-foreground" />
          <span className="mt-3 text-sm font-medium text-foreground">
            Click to choose images
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            Upload 8-20 selfies. JPG, PNG, WebP, HEIC, or HEIF.
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
            multiple
            className="sr-only text-[16px]"
            onChange={(event) => {
              const newFiles = Array.from(event.target.files ?? []);
              setFiles((prev) => [...prev, ...newFiles]);
              event.target.value = "";
            }}
          />
        </label>
        <p className="mt-2 text-xs text-muted-foreground">
          HEIC (iPhone) photos are supported.
        </p>
        {files.length > 0 && (
          <div className="mt-4">
            <div className="grid gap-2">
              {files.map((file, idx) => (
                <div
                  key={`${file.name}-${file.size}-${idx}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[color:var(--border)] bg-[color:var(--bg-3)] px-3 py-2 text-xs text-muted-foreground"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                    className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full px-2 py-1 text-base leading-none text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
                    aria-label={`Remove ${file.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-4 flex min-h-[44px] items-center gap-2 rounded-full border border-[color:var(--border)] bg-white px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-gray-50"
            >
              <span className="text-lg leading-none">+</span> Add more photos
            </button>
            <p className="mt-2 text-xs text-muted-foreground">
              {files.length}/20 photos selected
              {files.length < 8 && ` — add ${8 - files.length} more to continue`}
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#0a0a0a] px-6 text-base font-semibold text-white transition hover:scale-[1.01] hover:bg-[#222] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating your headshots...
            </>
          ) : (
            "Generate my headshots"
          )}
        </button>
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
      </form>
    </div>
  );
}
