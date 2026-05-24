"use client";

import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { FormEvent, useId, useState } from "react";

import {
  emptyWaitlistConsent,
  isWaitlistConsentValid,
  WaitlistConsentFields,
  type LegalConsentState,
} from "@/components/legal/legal-consent-fields";
import { cn } from "@/lib/utils";

type WaitlistFormProps = {
  variant?: "dark" | "light";
  className?: string;
  showLabel?: boolean;
  hideFooter?: boolean;
  submitLabel?: string;
};

export function WaitlistForm({
  variant = "light",
  className,
  showLabel = true,
  hideFooter = false,
  submitLabel = "Join early access",
}: WaitlistFormProps) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState<LegalConsentState>(emptyWaitlistConsent);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isWaitlistConsentValid(consent)) {
      setError("Please accept the Privacy Policy and Terms to continue.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          privacyAccepted: consent.privacyAccepted,
          termsAccepted: consent.termsAccepted,
          marketingConsent: consent.marketingConsent,
        }),
      });
      const json = (await res.json()) as {
        success?: boolean;
        message?: string;
        count?: number;
      };

      if (!res.ok || !json.success) {
        throw new Error(json.message ?? "Could not join the waitlist");
      }

      setSuccess(true);
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
          <span>You&apos;re on the waitlist. We&apos;ll email you when access opens.</span>
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      {showLabel && (
        <label
          htmlFor={inputId}
          className={cn(
            "mb-2 block text-sm font-semibold",
            variant === "dark" ? "text-white" : "text-[#111]"
          )}
        >
          Get early access
        </label>
      )}
      <form onSubmit={onSubmit} className="flex w-full flex-col gap-3">
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <input
            id={inputId}
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter your email"
            className={cn(
              "min-h-[52px] w-full min-w-0 flex-1 rounded-xl border px-4 text-[16px] outline-none transition focus:ring-2",
              variant === "dark"
                ? "border-white/15 bg-white text-[#111] placeholder:text-[#999] focus:border-white focus:ring-white/20"
                : "border-[#e8e8e8] bg-white text-[#111] placeholder:text-[#999] focus:border-[#111] focus:ring-[#111]/10"
            )}
          />
          <button
            type="submit"
            disabled={loading || !isWaitlistConsentValid(consent)}
            className={cn(
              "inline-flex min-h-[52px] w-full items-center justify-center rounded-xl px-4 text-[16px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-6",
              variant === "dark"
                ? "border border-white/15 bg-black text-white hover:bg-gray-900"
                : "bg-[#0a0a0a] text-white hover:bg-[#222]"
            )}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Joining...
              </>
            ) : (
              submitLabel
            )}
          </button>
        </div>

        <WaitlistConsentFields value={consent} onChange={setConsent} variant={variant} />
      </form>

      {!hideFooter && (
        <p className={cn("mt-3 text-sm", variant === "dark" ? "text-white/70" : "text-[#666]")}>
          Founding members lock in €29 at launch. Join 1,200+ already on the list.{" "}
          <Link
            href="/privacy"
            className={cn("underline underline-offset-4", variant === "dark" ? "text-white/90" : "text-gray-700")}
          >
            Privacy
          </Link>
        </p>
      )}
      {error && (
        <p className={cn("mt-3 text-sm", variant === "dark" ? "text-red-200" : "text-red-600")}>
          {error}
        </p>
      )}
    </div>
  );
}
