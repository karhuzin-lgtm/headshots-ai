"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isPlanId, type PlanId } from "@/lib/plans";
import { cn } from "@/lib/utils";

const MIN_PHOTOS = 3;
const MAX_PHOTOS = 20;

const ACCEPTED_MIME = new Set(["image/jpeg", "image/png"]);
const ACCEPT_ATTR = "image/jpeg,image/png";

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
  const canContinue = count >= MIN_PHOTOS && count <= MAX_PHOTOS;

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
          ? "40 headshots"
          : plan === "pro"
            ? "80 headshots"
            : "120 headshots"}
      </p>

      <header className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Step 1 of 2</p>
        <h1 className="font-display mt-4 text-3xl font-normal tracking-[-0.02em] text-gradient-display sm:text-4xl">
          Upload your photos
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed tracking-tight text-muted-foreground">
          Add {MIN_PHOTOS}–{MAX_PHOTOS} clear selfies (JPG or PNG). We generate every style automatically.
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
              : "border-gray-200 bg-gray-50 shadow-sm hover:border-primary/30 hover:bg-white"
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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-100 bg-white text-foreground/85 shadow-sm">
              <Upload className="h-6 w-6" strokeWidth={1.5} />
            </div>
            <p className="mt-5 text-base font-semibold tracking-tight text-foreground">
              Drag & drop photos here
            </p>
            <p className="mt-2 text-sm tracking-tight text-muted-foreground">
              or click to browse · JPG or PNG · max {MAX_PHOTOS} files
            </p>
            <span className="pointer-events-none mt-8 inline-flex h-11 items-center justify-center rounded-full border border-gray-200 bg-white px-6 text-[13px] font-semibold text-foreground shadow-sm">
              <ImagePlus className="mr-2 h-4 w-4" />
              Choose files
            </span>
          </div>
        </label>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p
            className={cn(
              "text-sm font-medium tabular-nums tracking-tight",
              count >= MIN_PHOTOS ? "text-muted-foreground" : "text-amber-600"
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
            <p className="text-xs tracking-tight text-amber-600 sm:text-right">{hint}</p>
          )}
        </div>

        {photos.length > 0 && (
          <ul className="mt-8 grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-5">
            {photos.map((p) => (
              <li
                key={p.id}
                className="group relative aspect-square overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
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

      <div className="mt-16 flex flex-col items-center gap-4 border-t border-gray-100 pt-12">
        <Button
          type="button"
          disabled={!canContinue || submitting}
          onClick={() => void handleGenerate()}
          className="h-12 w-full max-w-md rounded-full border-0 bg-black text-[15px] font-semibold tracking-tight text-white shadow-none hover:bg-gray-900 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 md:w-auto md:min-w-[280px]"
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
          <p className="max-w-md text-center text-xs text-amber-600">{submitError}</p>
        )}
        {!canContinue && (
          <p className="max-w-md text-center text-xs tracking-tight text-muted-foreground/90">
            Upload {MIN_PHOTOS}–{MAX_PHOTOS} selfies to continue.
          </p>
        )}
      </div>
    </div>
  );
}
