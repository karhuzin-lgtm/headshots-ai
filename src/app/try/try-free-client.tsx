"use client";

import { upload } from "@vercel/blob/client";
import { Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

import {
  emptyWaitlistConsent,
  isPhotoConsentValid,
  PhotoProcessingConsentFields,
  type LegalConsentState,
} from "@/components/legal/legal-consent-fields";
import { DISPLAY_STYLES } from "@/lib/display-styles";
import { HEADSHOT_COUNT, PRICE_LABEL, STYLE_COUNT } from "@/lib/landing-config";
import type { Tier } from "@/lib/tiers";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const TIPS_GOOD = [
  "Хорошее освещение — лицо чётко видно, без контрового света",
  "Разные ракурсы: анфас, чуть влево, чуть вправо",
  "Разные эмоции: улыбка, нейтральное, серьёзное",
  "2–3 разных образа на фотографиях",
  "Снимки за последние 6 месяцев — только актуальный вид",
];

const TIPS_BAD = [
  "Без очков, головных уборов и масок на лице",
  "Без групповых фото — в кадре только вы",
  "Без сильных фильтров и режима «бьюти»",
  "Без фото, где вы выглядите уставшим, больным или отёкшим",
];

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxDim = 1024;
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
        0.72
      );
    };
    img.src = url;
  });
}

function StylePreviewStrip() {
  return (
    <div className="flex justify-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {DISPLAY_STYLES.map((style) => (
        <div
          key={style.key}
          className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg ring-1 ring-gray-200/80"
          title={style.name}
        >
          <Image
            src={style.photo}
            alt=""
            width={44}
            height={56}
            className="h-full w-full object-cover object-top"
            sizes="44px"
          />
        </div>
      ))}
    </div>
  );
}

export function TryFreeClient({ tiers = [] }: { tiers?: Tier[] }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string | null>(null);
  const [consent, setConsent] = useState<LegalConsentState>(emptyWaitlistConsent);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Tier selection. When no per-tier LavaTop offers are configured, `tiers` is
  // empty and we fall back to the single default offer + landing-config price.
  const searchParams = useSearchParams();
  const hasTiers = tiers.length > 0;
  const requestedTier = searchParams.get("tier");
  const defaultTier =
    tiers.find((t) => t.id === requestedTier) ?? tiers.find((t) => t.popular) ?? tiers[0];
  const [tierId, setTierId] = useState<string | undefined>(defaultTier?.id);
  const selectedTier = hasTiers ? tiers.find((t) => t.id === tierId) ?? defaultTier : undefined;
  const priceLabel = selectedTier?.priceLabel ?? PRICE_LABEL;
  const photoCount = selectedTier?.expectedCount ?? HEADSHOT_COUNT;
  const styleCount = selectedTier?.styleKeys.length ?? STYLE_COUNT;
  const perStyle = Math.max(1, Math.round(photoCount / styleCount));
  const postTier = selectedTier?.id ?? "pro";

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  function addFiles(incoming: File[]) {
    setFiles((prev) => [...prev, ...incoming].slice(0, 20));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const normalizedEmail = email.trim().toLowerCase();
    if (!EMAIL_RE.test(normalizedEmail)) {
      setError("Введите корректный email.");
      return;
    }

    if (!isPhotoConsentValid(consent)) {
      setError("Подтвердите возраст, примите условия и согласие на обработку фото.");
      return;
    }

    if (files.length < 8 || files.length > 20) {
      setError("Загрузите хотя бы 8 селфи для лучшего результата.");
      return;
    }

    setLoading(true);
    setUploadProgress(null);

    try {
      const compressed = await Promise.all(files.map(compressImage));
      const photoUrls: string[] = [];

      for (let i = 0; i < compressed.length; i++) {
        setUploadProgress(`Загружаем фото ${i + 1} из ${compressed.length}…`);
        const file = compressed[i];
        const pathname = `try-free/${crypto.randomUUID()}.jpg`;
        const blob = await upload(pathname, file, {
          access: "public",
          handleUploadUrl: "/api/try-free/upload",
          contentType: "image/jpeg",
        });
        photoUrls.push(blob.url);
      }

      setUploadProgress("Переходим к оплате…");

      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, photoUrls, tier: postTier }),
      });
      const text = await res.text();
      let json: { url?: string; id?: string; error?: string } = {};
      try {
        json = text
          ? (JSON.parse(text) as { url?: string; id?: string; error?: string })
          : {};
      } catch {
        json = { error: text };
      }
      if (!res.ok || !json.url) {
        throw new Error(json.error || text || "Не удалось перейти к оплате.");
      }

      // Redirect straight to the LavaTop checkout. The pending generation id is
      // stored in an httpOnly cookie by /api/payment/create, so after a
      // successful payment LavaTop returns the buyer to /try/payment-return,
      // which forwards them to /try/result/{id} (the waiting screen).
      window.location.href = json.url;
      return;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось перейти к оплате.");
      setLoading(false);
      setUploadProgress(null);
    }
  }

  return (
    <div className="relative mx-auto w-full max-w-2xl px-5 pb-20 sm:px-6">
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-lg sm:p-8"
      >
        <div>
          <label htmlFor="try-email" className="text-sm font-semibold text-[#111827]">
            Email
          </label>
          <input
            id="try-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="вы@почта.рф"
            className="mt-2 min-h-[52px] w-full rounded-xl border border-gray-200 bg-white px-4 text-base text-[#111827] outline-none transition placeholder:text-gray-400 focus:border-[#111827] focus:ring-2 focus:ring-[#111827]/10"
          />
          <p className="mt-2 text-xs text-gray-500">
            Результат придёт на почту примерно через 20 минут. Аккаунт не нужен.
          </p>
        </div>

        {hasTiers && tiers.length > 1 && (
          <div className="mt-8">
            <p className="text-sm font-semibold text-[#111827]">Тариф</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {tiers.map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTierId(t.id)}
                  className={cn(
                    "rounded-xl border p-3 text-left transition",
                    selectedTier?.id === t.id
                      ? "border-[#111827] bg-white ring-2 ring-[#111827]/10"
                      : "border-gray-200 bg-[#faf8f5] hover:border-[#c9a96e]/50"
                  )}
                >
                  <span className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#111827]">{t.name}</span>
                    {t.popular && (
                      <span className="rounded-full bg-[#111827] px-2 py-0.5 text-[10px] font-semibold text-white">
                        Хит
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-sm font-semibold text-[#9a7b4f]">{t.priceLabel}</span>
                  <span className="mt-0.5 block text-xs text-gray-500">
                    {t.expectedCount} фото · {t.styleKeys.length} стилей
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 rounded-xl border border-[#c9a96e]/20 bg-[#faf8f5] p-4">
          <p className="text-sm font-medium text-[#111827]">
            Вы получите {photoCount} фотографий — {styleCount} профессиональных стилей × {perStyle} фото в каждом.
          </p>
          <div className="mt-4">
            <StylePreviewStrip />
          </div>
        </div>

        <div className="mt-8">
          <p className="text-sm font-semibold text-[#111827]">Советы для лучшего результата</p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {TIPS_GOOD.map((text) => (
              <li key={text} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="mt-0.5 font-bold text-[#c9a96e]">✓</span>
                {text}
              </li>
            ))}
            {TIPS_BAD.map((text) => (
              <li key={text} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="mt-0.5 font-bold text-red-500">✗</span>
                {text}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <label className="text-sm font-semibold text-[#111827]">
            Селфи
            <span className="ml-2 font-normal text-gray-500">8–20 фото</span>
          </label>
          <label
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files?.length) addFiles(Array.from(e.dataTransfer.files));
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            className={cn(
              "mt-3 flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition",
              isDragging
                ? "border-[#c9a96e]/60 bg-[#faf8f5]"
                : "border-gray-200 bg-[#faf8f5] hover:border-[#c9a96e]/40 hover:bg-white"
            )}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-gray-700 shadow-sm ring-1 ring-gray-100">
              <Upload className="h-5 w-5" aria-hidden />
            </span>
            <span className="mt-4 text-sm font-medium text-gray-900">Перетащите файлы или нажмите для выбора</span>
            <span className="mt-1 text-xs text-gray-500">JPG, PNG, WebP, HEIC · максимум 20 файлов</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              multiple
              className="sr-only"
              onChange={(event) => {
                if (event.target.files?.length) addFiles(Array.from(event.target.files));
                event.target.value = "";
              }}
            />
          </label>

          {files.length > 0 && (
            <div className="mt-4">
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                {previews.map((url, idx) => (
                  <div
                    key={url}
                    className="relative aspect-square overflow-hidden rounded-xl ring-1 ring-gray-200/80"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-xs leading-none text-white"
                      aria-label="Удалить фото"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-gray-500">
                Выбрано {files.length}/20 фото
                {files.length < 8 && ` — добавьте ещё ${8 - files.length}, чтобы продолжить`}
              </p>
            </div>
          )}
        </div>

        <PhotoProcessingConsentFields value={consent} onChange={setConsent} className="mt-8" />

        <button
          type="submit"
          disabled={loading || !isPhotoConsentValid(consent)}
          className="mt-8 inline-flex min-h-[52px] w-full items-center justify-center rounded-full bg-[#111827] text-base font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {uploadProgress ?? "Готовим оплату…"}
            </>
          ) : (
            `Сгенерировать портреты — ${priceLabel} →`
          )}
        </button>

        <p className="mt-3 text-center text-xs text-gray-500">
          Разовый платёж {priceLabel} · {photoCount} фото в {styleCount} стилях · оплата картой
        </p>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      </form>
    </div>
  );
}
