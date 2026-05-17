"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type StatusResponse = {
  id?: string;
  status?: "pending" | "processing" | "done" | "failed";
  imageUrl?: string;
  outputUrls?: string[];
  error?: string;
};

const STYLE_LABELS = [
  "Corporate",
  "Tech Casual",
  "Executive",
  "Creative",
  "Startup",
  "LinkedIn Classic",
];

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
    const startedAt = Date.now();
    const timeoutMs = 45 * 60 * 1000;

    async function poll() {
      if (Date.now() - startedAt >= timeoutMs) {
        if (!cancelled) setTimedOut(true);
        return;
      }

      try {
        let statusUrl: string;
        try {
          statusUrl = `/api/status/${requestId}`;
        } catch (urlError) {
          console.error("Invalid requestId for status URL:", requestId, urlError);
          throw new Error("Could not check status for this generation.");
        }
        const res = await fetch(statusUrl, { cache: "no-store" });
        const json = (await res.json()) as StatusResponse;
        if (!res.ok) throw new Error(json.error ?? "Could not load status.");
        if (!cancelled) {
          setStatus(json);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Could not load status.");
      }
    }

    void poll();
    const id = setInterval(() => {
      if (Date.now() - startedAt >= timeoutMs) {
        setTimedOut(true);
        clearInterval(id);
        return;
      }
      void poll();
    }, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [requestId]);

  if (timedOut && (!status || status.status === "pending" || status.status === "processing")) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-gradient-display">
          Processing took longer than expected
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Check your email — we&apos;ll send results when ready.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-gradient-display">Something went wrong</h1>
        <p className="mt-4 text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!status || status.status === "pending" || status.status === "processing") {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
        <div className="glass-panel-strong w-full rounded-3xl px-8 py-12">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
          <h1 className="font-display mt-8 text-3xl font-normal text-gradient-display">
            Creating your headshots
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Status: {status?.status ?? "starting"}. Training usually takes ~15 minutes.
          </p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            You can close this tab. We&apos;ll email you as soon as your headshots are ready.
          </p>
        </div>
      </div>
    );
  }

  if (status.status === "failed") {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-3xl text-gradient-display">Generation failed</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {status.error ?? "Please try again later."}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 text-center sm:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
        Your free headshots
      </p>
      <h1 className="font-display mt-5 text-3xl font-normal text-gradient-display sm:text-4xl">
        Your professional AI headshots are ready
      </h1>
      {outputUrls.length > 0 && (
        <div className="mt-10 space-y-10">
          {STYLE_LABELS.map((label, styleIdx) => {
            const styleUrls = outputUrls.slice(styleIdx * 3, styleIdx * 3 + 3);
            if (styleUrls.length === 0) return null;
            const displayLabel = outputUrls.length <= 3 ? "Selected Style" : label;
            return (
              <div key={label}>
                <p className="mb-4 text-sm font-semibold text-foreground">{displayLabel}</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {styleUrls.map((imageUrl, i) => (
                    <div key={imageUrl} className="glass-panel-strong overflow-hidden rounded-3xl p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imageUrl}
                        alt={`${displayLabel} headshot ${i + 1}`}
                        className="aspect-[3/4] w-full rounded-[1.25rem] object-cover"
                      />
                      <a
                        href={imageUrl}
                        download={`headshot-${displayLabel.toLowerCase().replace(/ /g, "-")}-${i + 1}.jpg`}
                        className="mt-2 flex items-center justify-center gap-1 rounded-xl py-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
                      >
                        ↓ Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <p className="mx-auto mt-10 max-w-md text-sm leading-relaxed text-muted-foreground">
        Want more styles and variations? We&apos;re launching paid plans soon.
      </p>
    </div>
  );
}
