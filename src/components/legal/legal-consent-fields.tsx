"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

export type LegalConsentState = {
  privacyAccepted: boolean;
  termsAccepted: boolean;
  ageConfirmed: boolean;
  photoProcessingConsent: boolean;
  marketingConsent: boolean;
};

type BaseProps = {
  value: LegalConsentState;
  onChange: (next: LegalConsentState) => void;
  variant?: "light" | "dark";
  className?: string;
};

function CheckboxRow({
  id,
  checked,
  onChange,
  required,
  variant,
  children,
}: {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  variant: "light" | "dark";
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 text-sm leading-relaxed",
        variant === "dark" ? "text-white/85" : "text-gray-600"
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required={required}
        className="mt-1 h-4 w-4 shrink-0 rounded border-gray-300 text-gray-900 focus:ring-gray-900"
      />
      <span>{children}</span>
    </label>
  );
}

function LegalLink({ href, variant }: { href: string; variant: "light" | "dark" }) {
  return (
    <Link
      href={href}
      className={cn(
        "font-medium underline underline-offset-4",
        variant === "dark" ? "text-white" : "text-gray-900"
      )}
      target="_blank"
      rel="noopener noreferrer"
    >
      {href === "/privacy" ? "Privacy Policy" : href === "/terms" ? "Terms of Service" : "Legal Notice"}
    </Link>
  );
}

export function WaitlistConsentFields({ value, onChange, variant = "light", className }: BaseProps) {
  const set = (patch: Partial<LegalConsentState>) => onChange({ ...value, ...patch });

  return (
    <div className={cn("space-y-3", className)}>
      <CheckboxRow
        id="waitlist-privacy"
        checked={value.privacyAccepted}
        onChange={(checked) => set({ privacyAccepted: checked, termsAccepted: checked })}
        required
        variant={variant}
      >
        I have read and accept the <LegalLink href="/privacy" variant={variant} /> and{" "}
        <LegalLink href="/terms" variant={variant} />.
      </CheckboxRow>
      <CheckboxRow
        id="waitlist-marketing"
        checked={value.marketingConsent}
        onChange={(marketingConsent) => set({ marketingConsent })}
        variant={variant}
      >
        I agree to receive product updates and early-access emails (optional). You can unsubscribe anytime.
      </CheckboxRow>
    </div>
  );
}

export function PhotoProcessingConsentFields({ value, onChange, variant = "light", className }: BaseProps) {
  const set = (patch: Partial<LegalConsentState>) => onChange({ ...value, ...patch });

  return (
    <div className={cn("space-y-3 rounded-2xl border border-gray-100 bg-[#f9fafb] p-4", className)}>
      <CheckboxRow
        id="photo-age"
        checked={value.ageConfirmed}
        onChange={(ageConfirmed) => set({ ageConfirmed })}
        required
        variant={variant}
      >
        I confirm I am at least 18 years old and uploading photos of myself (or someone I am authorized to
        represent).
      </CheckboxRow>
      <CheckboxRow
        id="photo-privacy"
        checked={value.privacyAccepted && value.termsAccepted}
        onChange={(checked) => set({ privacyAccepted: checked, termsAccepted: checked })}
        required
        variant={variant}
      >
        I have read and accept the <LegalLink href="/privacy" variant={variant} /> and{" "}
        <LegalLink href="/terms" variant={variant} />.
      </CheckboxRow>
      <CheckboxRow
        id="photo-processing"
        checked={value.photoProcessingConsent}
        onChange={(photoProcessingConsent) => set({ photoProcessingConsent })}
        required
        variant={variant}
      >
        I explicitly consent to processing my facial photos to train a private AI model and generate my
        headshots. I understand I can withdraw consent and request deletion at any time.
      </CheckboxRow>
    </div>
  );
}

export const emptyWaitlistConsent: LegalConsentState = {
  privacyAccepted: false,
  termsAccepted: false,
  ageConfirmed: false,
  photoProcessingConsent: false,
  marketingConsent: false,
};

export function isWaitlistConsentValid(value: LegalConsentState): boolean {
  return value.privacyAccepted && value.termsAccepted;
}

export function isPhotoConsentValid(value: LegalConsentState): boolean {
  return (
    value.ageConfirmed &&
    value.privacyAccepted &&
    value.termsAccepted &&
    value.photoProcessingConsent
  );
}
