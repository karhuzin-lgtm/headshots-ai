"use client";

import { Briefcase, Crown, Laptop, Linkedin, Loader2, Palette, Rocket, Upload } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDim = 800;
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
        0.75
      );
    };
    img.src = url;
  });
}

const STYLE_OPTIONS = [
  {
    id: "corporate",
    label: "Corporate",
    description: "Navy suit, neutral gray background",
    Icon: Briefcase,
  },
  {
    id: "tech_casual",
    label: "Tech Casual",
    description: "Smart casual, blurred office background",
    Icon: Laptop,
  },
  {
    id: "executive",
    label: "Executive",
    description: "Dark suit, Rembrandt lighting",
    Icon: Crown,
  },
  {
    id: "creative",
    label: "Creative",
    description: "Stylish attire, bokeh background",
    Icon: Palette,
  },
  {
    id: "startup",
    label: "Startup",
    description: "Casual confident, white background",
    Icon: Rocket,
  },
  {
    id: "linkedin",
    label: "LinkedIn Classic",
    description: "Business formal, light gradient background",
    Icon: Linkedin,
  },
] as const;

export function TryFreeClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get("email")?.trim().toLowerCase() ?? "", [searchParams]);
  const [selectedStyle, setSelectedStyle] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
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
      setError("Choose a headshot style.");
      return;
    }

    if (files.length < 3 || files.length > 20) {
      setError("Upload 3-20 selfies. For best results, use 10 or more.");
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
        Upload 10-20 selfies to generate your free headshot
      </h1>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
        More references means better results. We&apos;ll save your photos securely and create your
        professional headshots in ~15-20 minutes. No credit card.
      </p>

      <form onSubmit={onSubmit} className="glass-panel mt-10 rounded-3xl p-5 text-left sm:p-7">
        <div>
          <p className="text-sm font-semibold text-foreground">Choose your style</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {STYLE_OPTIONS.map(({ id, label, description, Icon }) => {
              const selected = selectedStyle === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedStyle(id)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition",
                    selected
                      ? "border-primary bg-primary/10 text-foreground"
                      : "border-white/10 bg-white/[0.03] text-muted-foreground hover:border-primary/35 hover:bg-white/[0.05]"
                  )}
                  aria-pressed={selected}
                >
                  <span className="flex items-center gap-3">
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-xl",
                        selected ? "bg-primary text-primary-foreground" : "bg-white/10 text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-foreground">
                        {label}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed">
                        {description}
                      </span>
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <label className="mt-7 block text-sm font-semibold text-foreground">
          Selfies
          <span className="ml-2 font-normal text-muted-foreground">
            Upload 10-20 selfies (more = better results)
          </span>
        </label>
        <label className="mt-3 flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-white/[0.03] px-4 py-8 text-center transition hover:border-primary/35 hover:bg-white/[0.05]">
          <Upload className="h-7 w-7 text-muted-foreground" />
          <span className="mt-3 text-sm font-medium text-foreground">
            Click to choose images
          </span>
          <span className="mt-1 text-xs text-muted-foreground">
            Upload 10-20 selfies (more = better results). JPG, PNG, or WebP.
          </span>
          <input
            type="file"
            accept="image/*"
            multiple
            className="sr-only"
            onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
          />
        </label>
        {files.length > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            {files.length} file{files.length === 1 ? "" : "s"} selected
          </p>
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
