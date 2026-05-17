"use client";

import { Loader2, Upload } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useRef, useState } from "react";

const STYLE_OPTIONS = [
  {
    id: "corporate",
    name: "Corporate",
    description: "Navy suit, gray studio background",
  },
  {
    id: "tech",
    name: "Tech",
    description: "Dark sweater, modern office",
  },
  {
    id: "executive",
    name: "Executive",
    description: "Charcoal suit, dark backdrop",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Smart casual blazer, warm background",
  },
  {
    id: "startup",
    name: "Startup",
    description: "Plain t-shirt, clean white background",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    description: "Dress shirt, neutral gray",
  },
] as const;

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const email = useMemo(() => searchParams.get("email")?.trim().toLowerCase() ?? "", [searchParams]);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email) {
      setError("Missing email. Join from the homepage first.");
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
      form.set("email", email);
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
      router.push(`/try/result/${json.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not start generation.");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-2xl flex-col justify-center px-4 py-16 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
        Early tester access
      </p>
      <h1 className="font-display mt-5 text-3xl font-normal tracking-[-0.02em] text-gradient-display sm:text-4xl">
        Upload 8-20 selfies for best results
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        We&apos;ll save your photos securely and create your
        professional headshots in ~15 minutes. No credit card.
      </p>

      <form onSubmit={onSubmit} className="glass-panel mt-10 rounded-3xl p-5 text-left sm:p-7">
        <div>
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
                      ? "mt-0.5 font-bold text-green-400"
                      : "mt-0.5 font-bold text-red-400"
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

        <div className="mt-7">
          <p className="text-sm font-semibold text-foreground">
            Choose your style
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {STYLE_OPTIONS.map((style) => {
              const isSelected = selectedStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => setSelectedStyle(style.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-white/10 bg-white/[0.03] hover:border-primary/35 hover:bg-white/[0.05]"
                  } cursor-pointer`}
                  aria-pressed={isSelected}
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-foreground">{style.name}</span>
                    <span
                      className={`h-3 w-3 rounded-full border ${
                        isSelected ? "border-primary bg-primary" : "border-white/30"
                      }`}
                      aria-hidden
                    />
                  </span>
                  <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
                    {style.description}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <label className="mt-7 block text-sm font-semibold text-foreground">
          Selfies
          <span className="ml-2 font-normal text-muted-foreground">
            Upload 8-20 selfies
          </span>
        </label>
        <label className="mt-3 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-8 text-center transition hover:border-primary/35 hover:bg-white/[0.05]">
          <Upload className="h-7 w-7 text-muted-foreground" />
          <span className="mt-3 text-sm font-medium text-foreground">
            Click to choose images
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            Upload 8-20 selfies. JPG, PNG, or WebP.
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => {
              const newFiles = Array.from(event.target.files ?? []);
              setFiles((prev) => [...prev, ...newFiles]);
              event.target.value = "";
            }}
          />
        </label>
        {files.length > 0 && (
          <div className="mt-4">
            <div className="grid gap-2">
              {files.map((file, idx) => (
                <div
                  key={`${file.name}-${file.size}-${idx}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-muted-foreground"
                >
                  <span className="truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                    className="shrink-0 rounded-full px-2 py-1 text-base leading-none text-muted-foreground transition hover:bg-white/10 hover:text-foreground"
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
              className="mt-4 flex items-center gap-2 rounded-xl border border-primary/40 px-4 py-2 text-sm font-semibold text-primary transition hover:border-primary hover:bg-primary/10"
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
          className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-b from-[hsl(40_35%_96%)] to-[hsl(36_26%_86%)] px-6 text-base font-semibold text-primary-foreground transition hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
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
