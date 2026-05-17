"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ALL_STYLE_KEYS, isPlanId, type PlanId } from "@/lib/plans";
import { cn } from "@/lib/utils";

const MIN_PHOTOS = 10;
const MAX_PHOTOS = 20;

const ACCEPTED_MIME = new Set(["image/jpeg", "image/png"]);
const ACCEPT_ATTR = "image/jpeg,image/png";

export type HeadshotStyleId =
  | "professional"
  | "linkedin"
  | "corporate"
  | "creative"
  | "casual";

type StyleOption = {
  id: HeadshotStyleId;
  title: string;
  description: string;
  preview: string;
};

const STYLES: StyleOption[] = [
  {
    id: "professional",
    title: "Professional",
    description: "Office polish, executive lighting",
    preview: "/images/fal-1778531811-1.jpg",
  },
  {
    id: "linkedin",
    title: "LinkedIn",
    description: "Clean, neutral backdrop",
    preview: "/images/fal-1778531813-1.jpg",
  },
  {
    id: "corporate",
    title: "Corporate",
    description: "Formal, confident energy",
    preview: "/images/corporate.jpg",
  },
  {
    id: "casual",
    title: "Casual",
    description: "Approachable, natural light",
    preview: "/images/fal-1778531810-1.jpg",
  },
  {
    id: "creative",
    title: "Creative",
    description: "Bold color, editorial feel",
    preview: "/images/creative.jpg",
  },
];

type PhotoItem = {
  id: string;
  file: File;
  url: string;
};

function isAcceptedImage(file: File): boolean {
  const name = file.name.toLowerCase();
  const extOk = name.endsWith(".jpg") || name.endsWith(".jpeg") || name.endsWith(".png");
  const mimeOk = !file.type || ACCEPTED_MIME.has(file.type);
  return extOk && mimeOk;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

type UploadFlowProps = {
  initialPlan?: string | null;
};

export function UploadFlow({ initialPlan }: UploadFlowProps) {
  const router = useRouter();
  const inputId = useId();
  const dragDepth = useRef(0);
  const photosRef = useRef<PhotoItem[]>([]);

  const plan: PlanId =
    initialPlan && isPlanId(initialPlan) ? initialPlan : "basic";

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(() =>
    plan === "basic" ? [] : [...ALL_STYLE_KEYS]
  );
  const [isDragging, setIsDragging] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    photosRef.current = photos;
  }, [photos]);

  useEffect(() => {
    return () => {
      photosRef.current.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

  useEffect(() => {
    if (plan !== "basic") {
      setSelectedStyles([...ALL_STYLE_KEYS]);
    }
  }, [plan]);

  const toggleStyle = useCallback(
    (id: string) => {
      if (plan !== "basic") return;
      setSelectedStyles((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        if (prev.length < 2) return [...prev, id];
        return [prev[0]!, id];
      });
    },
    [plan]
  );

  const addFiles = useCallback((fileList: FileList | File[]) => {
    const raw = Array.from(fileList);
    const accepted = raw.filter(isAcceptedImage);

    if (accepted.length === 0) {
      setHint("Only JPG and PNG images are allowed.");
      return;
    }

    const prev = photosRef.current;
    const remaining = MAX_PHOTOS - prev.length;

    if (remaining <= 0) {
      setHint(`You can upload at most ${MAX_PHOTOS} photos.`);
      return;
    }

    const toAdd = accepted.slice(0, remaining);
    const skipped = raw.filter((f) => !isAcceptedImage(f)).length;

    if (accepted.length > remaining) {
      setHint(
        `Only the first ${remaining} file(s) were added (max ${MAX_PHOTOS} photos).`
      );
    } else if (skipped > 0) {
      setHint("Some files were skipped (JPG or PNG only).");
    } else {
      setHint(null);
    }

    const additions: PhotoItem[] = toAdd.map((file) => ({
      id: generateId(),
      file,
      url: URL.createObjectURL(file),
    }));
    const next = [...prev, ...additions];
    photosRef.current = next;
    setPhotos(next);
  }, []);

  const removePhoto = useCallback((id: string) => {
    setPhotos((prev) => {
      const found = prev.find((p) => p.id === id);
      if (found) URL.revokeObjectURL(found.url);
      const next = prev.filter((p) => p.id !== id);
      photosRef.current = next;
      return next;
    });
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      dragDepth.current = 0;
      setIsDragging(false);
      if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const onDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current += 1;
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragging(false);
  }, []);

  const count = photos.length;
  const stylesReady = plan === "basic" ? selectedStyles.length === 2 : selectedStyles.length === 5;
  const canContinue = count >= MIN_PHOTOS && count <= MAX_PHOTOS && stylesReady;

  const handleGenerate = async () => {
    if (!canContinue || submitting) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const fd = new FormData();
      for (const p of photos) {
        fd.append("photos", p.file);
      }
      fd.append("plan", plan);
      fd.append("styles", JSON.stringify([...selectedStyles]));

      const res = await fetch("/api/jobs", { method: "POST", body: fd });
      const json = (await res.json()) as { jobId?: string; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Could not start job.");
      if (!json.jobId) throw new Error("Missing job id from server.");
      router.push(`/results/${json.jobId}`);
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const planLabel =
    plan === "basic" ? "Basic" : plan === "pro" ? "Pro" : "Executive";

  return (
    <div className="mx-auto w-full max-w-[900px] px-4 pb-24 pt-12 sm:pt-14 md:px-6 lg:px-8">
      <p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.18em] text-primary">
        {planLabel} plan ·{" "}
        {plan === "basic"
          ? "40 headshots, 2 styles"
          : plan === "pro"
            ? "80 headshots, 5 styles"
            : "120 headshots, all styles"}
      </p>

      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Step 1 of 2</p>
        <h1 className="font-display mt-4 text-3xl font-normal tracking-[-0.02em] text-gradient-display sm:text-4xl">
          Upload your photos
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed tracking-tight text-muted-foreground">
          Add {MIN_PHOTOS}–{MAX_PHOTOS} clear images (JPG or PNG).{" "}
          {plan === "basic"
            ? "Then pick exactly two styles for your pack."
            : "All five styles are included in this tier — we will generate across each look."}
        </p>
      </header>

      <section className="mt-10 w-full sm:mt-12">
        <label
          htmlFor={inputId}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          className={cn(
            "relative block w-full min-w-0 cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 sm:rounded-3xl",
            isDragging
              ? "border-primary/70 bg-primary/[0.07] shadow-[0_0_48px_-16px_hsl(var(--primary)/0.35)]"
              : "border-white/[0.12] bg-white/[0.03] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.45),inset_0_1px_0_0_rgba(255,255,255,0.05)] backdrop-blur-[28px] backdrop-saturate-150 hover:border-primary/30 hover:bg-white/[0.05]"
          )}
        >
          <input
            id={inputId}
            type="file"
            accept={ACCEPT_ATTR}
            multiple
            className="sr-only"
            onChange={(e) => {
              if (e.target.files?.length) addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <div className="flex flex-col items-center px-4 py-12 sm:px-6 sm:py-16">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.1] bg-white/[0.05] text-foreground/85 backdrop-blur-sm">
              <Upload className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <p className="mt-5 text-base font-semibold tracking-tight text-foreground">
              Drag & drop photos here
            </p>
            <p className="mt-2 text-sm tracking-tight text-muted-foreground">
              or click to browse · JPG or PNG · max {MAX_PHOTOS} files
            </p>
            <span className="pointer-events-none mt-8 inline-flex h-11 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.06] px-6 text-[13px] font-semibold text-foreground backdrop-blur-sm">
              <ImagePlus className="mr-2 h-4 w-4" />
              Choose files
            </span>
          </div>
        </label>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p
            className={cn(
              "text-sm font-medium tabular-nums tracking-tight",
              count >= MIN_PHOTOS ? "text-muted-foreground" : "text-amber-200/85"
            )}
          >
            {count} / {MAX_PHOTOS} photos uploaded
            {count < MIN_PHOTOS && count > 0 && (
              <span className="ml-2 text-xs font-normal text-muted-foreground/80">
                (need at least {MIN_PHOTOS})
              </span>
            )}
          </p>
          {hint && (
            <p className="text-xs tracking-tight text-amber-200/90 sm:text-right">{hint}</p>
          )}
        </div>

        {photos.length > 0 && (
          <ul className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5">
            {photos.map((p) => (
              <li
                key={p.id}
                className="group relative aspect-square overflow-hidden rounded-xl border border-white/[0.08] bg-card"
              >
                <Image
                  src={p.url}
                  alt={p.file.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 33vw, 20vw"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removePhoto(p.id);
                  }}
                  className="absolute right-1.5 top-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white opacity-0 backdrop-blur-sm transition hover:bg-red-500/90 group-hover:opacity-100"
                  aria-label={`Remove ${p.file.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-20">
        <h2 className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Styles for this pack
        </h2>
        <p className="font-display mt-4 text-center text-2xl font-normal tracking-[-0.02em] text-gradient-display">
          {plan === "basic" ? "Pick two looks" : "Included styles"}
        </p>
        <p className="mx-auto mt-2 max-w-md text-center text-sm tracking-tight text-muted-foreground">
          {plan === "basic"
            ? "Choose any two — we balance outputs evenly across them."
            : "LinkedIn, Corporate, Casual, Professional, and Creative are all generated for this tier."}
        </p>

        <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:mt-10 sm:grid-cols-2 md:grid-cols-3">
          {STYLES.map((s) => {
            const selected = selectedStyles.includes(s.id);
            const locked = plan !== "basic";
            return (
              <button
                key={s.id}
                type="button"
                disabled={locked}
                onClick={() => toggleStyle(s.id)}
                className={cn(
                  "flex min-h-[8.5rem] w-full min-w-0 flex-col overflow-hidden rounded-2xl border-2 bg-card/90 text-left outline-none backdrop-blur-sm transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:rounded-2xl",
                  selected
                    ? "border-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.35),0_16px_48px_-24px_hsl(var(--primary)/0.3)]"
                    : "border-white/[0.08] hover:border-primary/25",
                  locked && "cursor-default opacity-95"
                )}
              >
                <div className="relative flex gap-3 p-3 sm:p-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-white/[0.08]">
                    <Image src={s.preview} alt="" fill className="object-cover" sizes="64px" />
                  </div>
                  <div className="min-w-0 flex-1 py-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      {locked ? "Included" : "Tap to toggle"}
                    </span>
                    <span className="mt-1 block text-base font-semibold tracking-[-0.02em] text-foreground">
                      {s.title}
                    </span>
                    <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                      {s.description}
                    </span>
                  </div>
                </div>
                {selected && (
                  <div className="border-t border-white/[0.06] px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-primary sm:px-4">
                    {locked ? "In pack" : "Selected"}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <div className="mt-16 flex flex-col items-center gap-4 border-t border-white/[0.06] pt-12">
        <Button
          type="button"
          disabled={!canContinue || submitting}
          onClick={() => void handleGenerate()}
          className="h-12 w-full max-w-md rounded-full border-0 bg-gradient-to-b from-[hsl(40_35%_96%)] to-[hsl(36_26%_86%)] text-[15px] font-semibold tracking-tight text-primary-foreground shadow-none hover:brightness-[1.03] disabled:cursor-not-allowed disabled:from-white/20 disabled:to-white/15 disabled:text-foreground/40 md:w-auto md:min-w-[280px]"
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Starting…
            </>
          ) : (
            "Generate headshots"
          )}
        </Button>
        {submitError && (
          <p className="max-w-md text-center text-xs text-amber-200/90">{submitError}</p>
        )}
        {!canContinue && (
          <p className="max-w-md text-center text-xs tracking-tight text-muted-foreground/90">
            {plan === "basic"
              ? `Upload ${MIN_PHOTOS}–${MAX_PHOTOS} photos and select exactly two styles.`
              : `Upload ${MIN_PHOTOS}–${MAX_PHOTOS} photos to continue.`}
          </p>
        )}
      </div>
    </div>
  );
}
