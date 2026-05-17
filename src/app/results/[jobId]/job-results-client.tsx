"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Check, Loader2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type JobPoll = {
  id: string;
  status: string;
  plan: string;
  progress: number;
  total: number;
  paid: boolean;
  paymentRequired: boolean;
  error: string | null;
};

type Props = { jobId: string };

export function JobResultsClient({ jobId }: Props) {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const verifiedSession = useRef<string | null>(null);

  const [job, setJob] = useState<JobPoll | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const fetchJob = useCallback(async () => {
    const res = await fetch(`/api/jobs/${jobId}`, { cache: "no-store" });
    const json = (await res.json()) as JobPoll & { error?: string };
    if (!res.ok) {
      setLoadError(json.error ?? "Could not load job.");
      return null;
    }
    setLoadError(null);
    setJob(json as JobPoll);
    return json as JobPoll;
  }, [jobId]);

  useEffect(() => {
    void fetchJob();
  }, [fetchJob]);

  useEffect(() => {
    if (!sessionId || verifiedSession.current === sessionId) return;
    verifiedSession.current = sessionId;
    void (async () => {
      try {
        const res = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });
        if (res.ok) await fetchJob();
      } catch {
        /* ignore */
      }
    })();
  }, [sessionId, fetchJob]);

  useEffect(() => {
    let mounted = true;

    async function tick() {
      if (!mounted) return;
      const j = await fetchJob();
      if (!mounted || !j) return;
      if (j.status === "pending" || j.status === "processing") {
        try {
          const res = await fetch(`/api/jobs/${jobId}/process`, { method: "POST" });
          const body = (await res.json()) as { error?: string };
          if (!res.ok) setLoadError(body.error ?? "Generation step failed.");
          await fetchJob();
        } catch (e) {
          setLoadError(e instanceof Error ? e.message : "Generation failed.");
        }
      }
    }

    void tick();
    const id = setInterval(() => void tick(), 2800);
    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [jobId, fetchJob]);

  const pct =
    job && job.total > 0 ? Math.min(100, Math.round((job.progress / job.total) * 100)) : 0;

  async function startCheckout() {
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      const json = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Checkout failed");
      if (json.url) window.location.href = json.url;
    } catch (e) {
      setLoadError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  }

  if (loadError && !job) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-amber-400/90" />
        <p className="mt-4 text-sm text-muted-foreground">{loadError}</p>
        <Button asChild className="mt-8 rounded-full" variant="outline">
          <Link href="/upload">Try again</Link>
        </Button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-32 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm">Loading your job…</p>
      </div>
    );
  }

  if (job.status === "failed" || (job.error && job.status !== "completed")) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-red-400/90" />
        <p className="mt-4 text-sm text-muted-foreground">{job.error ?? loadError ?? "Failed"}</p>
        <Button asChild className="mt-8 rounded-full" variant="outline">
          <Link href="/upload">Back to upload</Link>
        </Button>
      </div>
    );
  }

  const generating = job.status === "pending" || job.status === "processing";

  if (generating) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center sm:py-28">
        <div className="glass-panel-strong w-full rounded-3xl px-8 py-12 sm:px-10">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <h1 className="font-display mt-8 text-2xl font-normal tracking-tight text-gradient-display sm:text-3xl">
            Creating your headshots
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This usually takes about two to five minutes. Keep this tab open.
          </p>
          <div className="mt-10 h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary/80 to-primary transition-[width] duration-500 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          <p className="mt-4 font-mono text-xs tabular-nums text-muted-foreground">
            {job.progress} / {job.total} renders
          </p>
        </div>
      </div>
    );
  }

  if (job.paymentRequired && !job.paid) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-20 text-center sm:py-28">
        <div className="glass-panel-strong w-full rounded-3xl px-8 py-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="font-display mt-8 text-2xl font-normal tracking-tight text-gradient-display sm:text-3xl">
            Your pack is ready
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {job.total} headshots are generated and stored securely. Complete payment to unlock full
            downloads and gallery access.
          </p>
          <Button
            type="button"
            disabled={checkoutLoading}
            onClick={() => void startCheckout()}
            className="mt-10 h-12 w-full rounded-full border-0 bg-gradient-to-b from-[hsl(40_35%_96%)] to-[hsl(36_26%_86%)] text-[15px] font-semibold text-primary-foreground hover:brightness-[1.03]"
          >
            {checkoutLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting…
              </>
            ) : (
              "Pay & unlock downloads"
            )}
          </Button>
          {loadError && <p className="mt-4 text-xs text-amber-200/90">{loadError}</p>}
        </div>
      </div>
    );
  }

  if (job.paid && job.status === "completed") {
    return (
      <div className="mx-auto w-full max-w-[1100px] px-4 py-12 sm:py-16 md:px-6">
        <div className="flex flex-col gap-3 border-b border-white/[0.06] pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">Your gallery</p>
            <h1 className="font-display mt-3 text-3xl font-normal tracking-tight text-gradient-display sm:text-4xl">
              {job.total} headshots
            </h1>
            <p className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground sm:justify-start">
              <Check className="h-4 w-4 text-primary" />
              Paid · {job.plan} pack
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full border-white/[0.14] bg-white/[0.04]">
            <Link href="/">Home</Link>
          </Button>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
          {Array.from({ length: job.total }).map((_, i) => (
            <li
              key={i}
              className={cn(
                "group relative aspect-[3/4] overflow-hidden rounded-2xl border border-white/[0.08] bg-card"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/api/jobs/${jobId}/image?i=${i}`}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-black/70 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
                <a
                  href={`/api/jobs/${jobId}/download?i=${i}`}
                  className="rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#14110e]"
                >
                  Download
                </a>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="py-24 text-center text-sm text-muted-foreground">
      Unexpected job state.{" "}
      <Link href="/upload" className="text-primary underline-offset-4 hover:underline">
        Start over
      </Link>
    </div>
  );
}
