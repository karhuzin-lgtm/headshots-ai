"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type WaitlistFormProps = {
  variant?: "dark" | "light";
  className?: string;
};

export function WaitlistForm({ variant = "light", className }: WaitlistFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadCount() {
      try {
        const res = await fetch("/api/waitlist", { cache: "no-store" });
        const json = (await res.json()) as { remaining?: number };
        if (!cancelled && typeof json.remaining === "number") {
          setRemaining(json.remaining);
        }
      } catch {
        // Count is nice-to-have; form still works without it.
      }
    }

    void loadCount();
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = (await res.json()) as {
        success?: boolean;
        message?: string;
        count?: number;
        remaining?: number;
      };

      if (!res.ok || !json.success) {
        throw new Error(json.message ?? "Could not join the waitlist");
      }

      if (typeof json.remaining === "number") setRemaining(json.remaining);
      setSuccess(true);
      window.setTimeout(() => {
        router.push(`/try?email=${encodeURIComponent(email.trim().toLowerCase())}`);
      }, 800);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not join the waitlist");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div
        className={cn(
          "rounded-2xl border px-5 py-4 text-left",
          variant === "dark"
            ? "border-white/15 bg-white/10 text-white"
            : "border-[#e8e8e8] bg-white text-[#111]",
          className
        )}
      >
        <p className="flex items-start gap-3 text-sm font-semibold">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          <span>You&apos;re in! Check your email for next steps.</span>
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <label
        htmlFor="waitlist-email"
        className={cn(
          "mb-2 block text-sm font-semibold",
          variant === "dark" ? "text-white" : "text-[#111]"
        )}
      >
        Get my free headshot →
      </label>
      {typeof remaining === "number" && (
        <p
          className={cn(
            "mb-3 text-sm",
            variant === "dark" ? "text-white/65" : "text-[#666]"
          )}
        >
          {remaining} of 100 spots remaining
        </p>
      )}
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-3 sm:flex-row">
        <input
          id="waitlist-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter your email"
          className={cn(
            "min-h-[52px] w-full min-w-0 flex-1 rounded-xl border px-4 text-[16px] outline-none transition focus:ring-2",
            variant === "dark"
              ? "border-white/20 bg-white/10 text-white placeholder:text-white/40 focus:border-white/35 focus:ring-white/20"
              : "border-[#e8e8e8] bg-white text-[#111] placeholder:text-[#999] focus:border-[#111] focus:ring-[#111]/10"
          )}
        />
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "inline-flex min-h-[52px] w-full items-center justify-center rounded-xl px-4 text-[16px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-6",
            variant === "dark"
              ? "bg-white text-black hover:bg-white/90"
              : "bg-[#111] text-white hover:bg-[#222]"
          )}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Joining...
            </>
          ) : (
            "Claim free access"
          )}
        </button>
      </form>
      {error && (
        <p className={cn("mt-3 text-sm", variant === "dark" ? "text-red-200" : "text-red-600")}>
          {error}
        </p>
      )}
    </div>
  );
}
