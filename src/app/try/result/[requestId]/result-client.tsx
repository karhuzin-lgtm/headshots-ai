"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";

import { DISPLAY_STYLES } from "@/lib/display-styles";

type StatusResponse = {
  id?: string;
  status?: "pending" | "processing" | "done" | "failed";
  imageUrl?: string;
  outputUrls?: string[];
  error?: string;
};

function downloadHref(url: string, filename: string): string {
  const params = new URLSearchParams({ url, filename });
  return `/api/download-image?${params.toString()}`;
}

function StatusCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`mx-auto max-w-lg rounded-2xl border border-gray-200/80 bg-white px-8 py-12 text-center shadow-lg ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

export function TryResultClient({ requestId }: { requestId: string }) {
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timedOut, setTimedOut] = useState(false);
  const outputUrls = status?.outputUrls?.length
    ? status.outputUrls
    : status?.imageUrl
      ? [status.imageUrl]
      : [];

  useEffect(() => {
    let cancelled = false;
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const startedAt = Date.now();
    const timeoutMs = 45 * 60 * 1000;

    async function poll(): Promise<boolean> {
      if (Date.now() - startedAt >= timeoutMs) {
        if (!cancelled) setTimedOut(true);
        return true;
      }

      try {
        const res = await fetch(`/api/status/${requestId}`, { cache: "no-store" });
        const json = (await res.json()) as StatusResponse;
        if (!res.ok) throw new Error(json.error ?? "Could not load status.");
        if (!cancelled) {
          setStatus(json);
          setError(null);
        }
        return json.status === "done" || json.status === "failed";
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load status.");
        return false;
      }
    }

    void poll().then((finished) => {
      if (finished || cancelled) return;
      intervalId = setInterval(async () => {
        const done = await poll();
        if (done && intervalId) clearInterval(intervalId);
      }, 5000);
    });

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
    };
  }, [requestId]);

  if (timedOut && (!status || status.status === "pending" || status.status === "processing")) {
    return (
      <div className="px-5 py-20 sm:py-28">
        <StatusCard>
          <h1 className="font-display text-2xl font-normal tracking-tight text-[#111827] sm:text-3xl">
            Taking longer than expected
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            Check your email — we&apos;ll send results when ready.
          </p>
        </StatusCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-5 py-20 sm:py-28">
        <StatusCard>
          <h1 className="font-display text-2xl font-normal tracking-tight text-[#111827]">Something went wrong</h1>
          <p className="mt-4 text-sm text-gray-600">{error}</p>
        </StatusCard>
      </div>
    );
  }

  if (!status || status.status === "pending" || status.status === "processing") {
    return (
      <div className="px-5 py-20 sm:py-28">
        <StatusCard>
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#c9a96e]" />
          <h1 className="mt-8 font-display text-2xl font-normal tracking-tight text-[#111827] sm:text-3xl">
            Creating your headshots
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            Status: {status?.status ?? "starting"}. Training usually takes ~20 minutes.
          </p>
          <p className="mt-2 text-sm text-gray-500">You can close this tab — we&apos;ll email you when ready.</p>
          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-gray-100">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-[#c9a96e]/70" />
          </div>
        </StatusCard>
      </div>
    );
  }

  if (status.status === "failed") {
    return (
      <div className="px-5 py-20 sm:py-28">
        <StatusCard>
          <h1 className="font-display text-2xl font-normal tracking-tight text-[#111827]">Generation failed</h1>
          <p className="mt-4 text-sm text-gray-600">{status.error ?? "Please try again later."}</p>
          <Link
            href="/try/generate"
            className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#111827] px-6 text-sm font-semibold text-white transition hover:bg-black"
          >
            Try again
          </Link>
        </StatusCard>
      </div>
    );
  }

  const imagesPerStyle = 3;
  const styleCount = Math.min(DISPLAY_STYLES.length, Math.ceil(outputUrls.length / imagesPerStyle));

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:py-20">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7b4f]">Ready</p>
        <h1 className="mt-4 font-display text-4xl font-normal tracking-tight text-[#111827] sm:text-5xl">
          Your headshots are ready
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-gray-600">
          {outputUrls.length} photos across {styleCount} styles · high resolution · yours to keep
        </p>
      </div>

      {outputUrls.length > 0 && (
        <div className="mt-12 space-y-12">
          {DISPLAY_STYLES.map((style, styleIdx) => {
            const styleUrls = outputUrls.slice(styleIdx * imagesPerStyle, styleIdx * imagesPerStyle + imagesPerStyle);
            if (styleUrls.length === 0) return null;
            return (
              <section key={style.key}>
                <h2 className="mb-4 text-center text-sm font-semibold text-[#111827] sm:text-left">{style.name}</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  {styleUrls.map((imageUrl, i) => {
                    const filename = `headshot-${style.key}-${i + 1}.jpg`;
                    return (
                      <div
                        key={imageUrl}
                        className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-2 shadow-sm"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={imageUrl}
                          alt={`${style.name} headshot ${i + 1}`}
                          className="aspect-[3/4] w-full rounded-xl object-cover object-top"
                        />
                        <a
                          href={downloadHref(imageUrl, filename)}
                          className="mt-2 flex w-full items-center justify-center rounded-lg py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-[#faf8f5] hover:text-[#111827]"
                        >
                          ↓ Download
                        </a>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      <div className="mx-auto mt-14 max-w-md rounded-2xl border border-gray-200/80 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-gray-600">Want more styles and variations?</p>
        <Link
          href="/#waitlist"
          className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#111827] text-sm font-semibold text-white transition hover:bg-black"
        >
          Join early access
        </Link>
      </div>
    </div>
  );
}
