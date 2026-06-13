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
        "group flex cursor-pointer items-start gap-3 text-sm leading-relaxed",
        variant === "dark" ? "text-white/70" : "text-black/60"
      )}
    >
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required={required}
        className={cn(
          "mt-1 h-4 w-4 shrink-0 rounded-sm focus:ring-black",
          variant === "dark" ? "border-white/30 bg-transparent text-white" : "border-black/20 bg-transparent text-black"
        )}
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
        variant === "dark" ? "text-white" : "text-black"
      )}
      target="_blank"
      rel="noopener noreferrer"
    >
      {href === "/privacy"
        ? "Политику конфиденциальности"
        : href === "/terms"
          ? "Условия использования"
          : href === "/consent"
            ? "Согласие на обработку биометрических данных"
            : "Правовую информацию"}
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
        Я прочитал(а) и принимаю <LegalLink href="/privacy" variant={variant} /> и{" "}
        <LegalLink href="/terms" variant={variant} />.
      </CheckboxRow>
      <CheckboxRow
        id="waitlist-marketing"
        checked={value.marketingConsent}
        onChange={(marketingConsent) => set({ marketingConsent })}
        variant={variant}
      >
        Согласен(на) получать новости о продукте и письма с ранним доступом (необязательно). Можно отписаться в любой момент.
      </CheckboxRow>
    </div>
  );
}

export function PhotoProcessingConsentFields({ value, onChange, variant = "light", className }: BaseProps) {
  const set = (patch: Partial<LegalConsentState>) => onChange({ ...value, ...patch });

  return (
    <div
      className={cn(
        "space-y-4 border-t pt-5",
        variant === "dark" ? "border-white/15" : "border-black/10",
        className
      )}
    >
      <CheckboxRow
        id="photo-age"
        checked={value.ageConfirmed}
        onChange={(ageConfirmed) => set({ ageConfirmed })}
        required
        variant={variant}
      >
        Подтверждаю, что мне есть 18 лет и я загружаю фотографии себя (или того, кого имею право
        представлять).
      </CheckboxRow>
      <CheckboxRow
        id="photo-privacy"
        checked={value.privacyAccepted && value.termsAccepted}
        onChange={(checked) => set({ privacyAccepted: checked, termsAccepted: checked })}
        required
        variant={variant}
      >
        Я прочитал(а) и принимаю <LegalLink href="/privacy" variant={variant} /> и{" "}
        <LegalLink href="/terms" variant={variant} />.
      </CheckboxRow>
      <CheckboxRow
        id="photo-processing"
        checked={value.photoProcessingConsent}
        onChange={(photoProcessingConsent) => set({ photoProcessingConsent })}
        required
        variant={variant}
      >
        Я даю явное согласие на обработку фотографий моего лица для обучения приватной AI-модели и генерации
        портретов (подробнее — <LegalLink href="/consent" variant={variant} />). Я понимаю, что могу отозвать
        согласие и запросить удаление в любой момент.
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
