"use client";

import { upload } from "@vercel/blob/client";
import { ArrowRight, Check, Loader2, Upload } from "lucide-react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";

import {
  emptyWaitlistConsent,
  isPhotoConsentValid,
  PhotoProcessingConsentFields,
  type LegalConsentState,
} from "@/components/legal/legal-consent-fields";
import { DISPLAY_STYLES, type ProductStyleKey } from "@/lib/display-styles";
import { HEADSHOT_COUNT, PRICE_LABEL, STYLE_COUNT } from "@/lib/landing-config";
import type { Tier } from "@/lib/tiers";
import { cn, pluralRu } from "@/lib/utils";

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

const HEIC_RE = /heic|heif/i;
function isHeic(file: File): boolean {
  return HEIC_RE.test(file.type) || HEIC_RE.test(file.name);
}

/**
 * Convert iPhone HEIC/HEIF to JPEG so it (a) previews in the browser and (b) is
 * usable by Astria. heic2any is heavy, so it's dynamically imported only when a
 * HEIC file is actually added.
 */
async function heicToJpeg(file: File): Promise<File> {
  if (!isHeic(file)) return file;
  try {
    const mod = (await import("heic2any")) as unknown as {
      default?: (opts: { blob: Blob; toType?: string; quality?: number }) => Promise<Blob | Blob[]>;
    };
    // heic2any is CommonJS — depending on bundling the fn is on .default or is
    // the module itself. Handle both so the call never silently throws.
    const convert = mod.default ?? (mod as unknown as typeof mod.default);
    if (typeof convert !== "function") throw new Error("heic2any not callable");
    const out = await convert({ blob: file, toType: "image/jpeg", quality: 0.92 });
    const blob = (Array.isArray(out) ? out[0] : out) as Blob;
    return new File([blob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), { type: "image/jpeg" });
  } catch (e) {
    console.error("HEIC→JPEG conversion failed:", e);
    return file; // keep original — server still accepts HEIC; preview falls back to placeholder
  }
}

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const img = document.createElement("img");
    const url = URL.createObjectURL(file);
    // Fall back to the original file on anything that can't be decoded in the
    // browser (e.g. HEIC on desktop/Android) — the upload route accepts HEIC, so
    // we never hang the form. (Previously: no onerror + blob! → permanent hang.)
    const finish = (result: File) => {
      URL.revokeObjectURL(url);
      resolve(result);
    };
    img.onerror = () => finish(file);
    img.onload = () => {
      try {
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
        const ctx = canvas.getContext("2d");
        if (!ctx) return finish(file);
        ctx.drawImage(img, 0, 0, w, h);
        canvas.toBlob(
          (blob) => finish(blob ? new File([blob], file.name, { type: "image/jpeg" }) : file),
          "image/jpeg",
          0.72
        );
      } catch {
        finish(file);
      }
    };
    img.src = url;
  });
}

function StylePreviewStrip({ styleKeys }: { styleKeys?: readonly ProductStyleKey[] }) {
  const visibleStyles = styleKeys?.length
    ? DISPLAY_STYLES.filter((style) => styleKeys.includes(style.key))
    : DISPLAY_STYLES;

  return (
    <div className="grid grid-cols-3 gap-2">
      {visibleStyles.map((style, index) => (
        <figure key={style.key} className={index > 2 ? "hidden sm:block" : ""}>
          <div className="relative aspect-[5/6] overflow-hidden border border-white/10 bg-white/[0.04] shadow-[0_12px_24px_rgba(0,0,0,0.16)]">
            <Image src={style.photo} alt="" fill className="object-contain" sizes="130px" />
          </div>
          <figcaption className="mt-2 truncate font-mono text-[7px] uppercase tracking-[0.18em] text-white/35">
            {style.name}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/**
 * Single selfie preview. Browsers can't decode HEIC in <img> (common from
 * iPhone), so on a decode error we show a labelled placeholder — the buyer still
 * sees that the photo is loaded instead of a blank square.
 */
function PreviewTile({
  url,
  index,
  onRemove,
}: {
  url: string;
  index: number;
  onRemove: () => void;
}) {
  const [broken, setBroken] = useState(false);
  return (
    <div className="relative aspect-[3/4] overflow-hidden border border-black/10 bg-[#d8d8d2]">
      {broken ? (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[#dfdfd9] text-center">
          <Check className="h-4 w-4 text-black" aria-hidden />
          <span className="text-[10px] font-medium text-black/45">Фото {index + 1}</span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          className="h-full w-full object-contain"
          onError={() => setBroken(true)}
        />
      )}
      <button
        type="button"
        onClick={onRemove}
        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center border border-white/20 bg-black/75 text-xs leading-none text-white backdrop-blur-sm"
        aria-label="Удалить фото"
      >
        ×
      </button>
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
  const [processing, setProcessing] = useState(false);

  const searchParams = useSearchParams();
  const hasTiers = tiers.length > 0;
  const [tierId, setTierId] = useState<string | undefined>();
  const selectedTier = tiers.find((t) => t.id === tierId);
  const priceLabel = selectedTier?.priceLabel ?? PRICE_LABEL;
  const photoCount = selectedTier?.expectedCount ?? HEADSHOT_COUNT;
  const styleCount = selectedTier?.styleKeys.length ?? STYLE_COUNT;
  const perStyle = selectedTier ? selectedTier.imagesPerStyle : Math.max(1, Math.round(photoCount / styleCount));

  useEffect(() => {
    const urls = files.map((f) => URL.createObjectURL(f));
    setPreviews(urls);
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  // Reset the submit spinner if the buyer returns via the browser "back" button
  // from the LavaTop page (bfcache restore keeps loading=true otherwise).
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        setLoading(false);
        setUploadProgress(null);
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  async function addFiles(incoming: File[]) {
    // accept= only constrains the picker, not drag-drop — filter to images here.
    const images = incoming.filter((f) => f.type.startsWith("image/") || isHeic(f));
    if (!images.length) return;
    setProcessing(true);
    try {
      // Convert HEIC → JPEG up front (previewable + Astria-compatible).
      const converted = await Promise.all(images.map(heicToJpeg));
      setFiles((prev) => [...prev, ...converted].slice(0, 20));
    } finally {
      setProcessing(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!selectedTier) {
      setError("Сначала выберите один из трёх наборов.");
      document.getElementById("choose")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

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
        body: JSON.stringify({
          email: normalizedEmail,
          photoUrls,
          tier: selectedTier.id,
          testKey: searchParams.get("test") ?? undefined,
        }),
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
      if (!res.ok || !json.url || !json.id) {
        throw new Error(json.error || text || "Не удалось перейти к оплате.");
      }

      // LavaTop has no post-payment redirect back to us, so we DON'T navigate
      // away to it. Instead: open checkout in a new tab (this is inside the
      // submit gesture, so it isn't popup-blocked) and send THIS tab to our
      // waiting page, which polls for payment and shows generation right here.
      // Test mode returns an internal /try/result url → just navigate. Normal
      // flow returns the LavaTop (http) url → open it in a new tab + go to the
      // waiting page in this tab.
      if (json.url.startsWith("http")) {
        window.open(json.url, "_blank", "noopener");
      }
      window.location.href = `/try/result/${json.id}`;
      return;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось перейти к оплате.");
      setLoading(false);
      setUploadProgress(null);
    }
  }

  return (
    <div id="choose" className="relative mx-auto w-full max-w-[1500px] scroll-mt-24 px-5 pb-24 sm:px-7">
      <form onSubmit={onSubmit} className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
        <aside className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <div className="overflow-hidden border border-white/10 bg-[#11110f] p-5 text-white sm:p-7">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-6">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.24em] text-white/35">Ваш заказ</p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.06em]">
                  {selectedTier?.name ?? "Выберите набор"}
                </h2>
                <p className="mt-2 text-sm text-white/40">
                  {selectedTier?.tagline ?? "Сравните условия и выберите подходящий объём"}
                </p>
              </div>
              <span className="border border-white/10 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.18em] text-white/40">
                {selectedTier ? `${photoCount} фото` : "Не выбран"}
              </span>
            </div>

            <div className="mt-7">
              <StylePreviewStrip styleKeys={selectedTier?.styleKeys} />
            </div>

            <div className="mt-7 grid grid-cols-2 gap-px overflow-hidden border border-white/10 bg-white/10">
              <div className="bg-[#11110f] p-4">
                <p className="font-display text-3xl font-semibold tracking-[-0.07em]">{selectedTier ? styleCount : "—"}</p>
                <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.2em] text-white/30">{selectedTier ? pluralRu(styleCount, "стиль", "стиля", "стилей") : "стилей"}</p>
              </div>
              <div className="bg-[#11110f] p-4">
                <p className="font-display text-3xl font-semibold tracking-[-0.07em]">{selectedTier ? perStyle : "—"}</p>
                <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.2em] text-white/30">фото на стиль</p>
              </div>
            </div>

            <div className="mt-7 flex items-end justify-between border-t border-white/10 pt-6">
              <div>
                <p className="font-display text-5xl font-semibold tracking-[-0.08em]">{selectedTier ? priceLabel : "—"}</p>
                <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.2em] text-white/30">разовый платёж</p>
              </div>
              <p className="max-w-[150px] text-right text-xs leading-5 text-white/35">
                Результат на почту примерно через 20 минут
              </p>
            </div>
          </div>
        </aside>

        <div className="bg-[#edede7] p-5 text-[#11110f] sm:p-8 lg:p-10">
          <section>
            <div className="flex items-center gap-4 border-b border-black/10 pb-5">
              <span className="font-mono text-[9px] tracking-[0.2em] text-black/30">01</span>
              <div className="flex-1">
                <h2 className="font-display text-2xl font-semibold tracking-[-0.05em]">Выберите набор</h2>
                <p className="mt-1 text-xs leading-5 text-black/45">Ничего не выбрано заранее. Сравните состав и нажмите на подходящий вариант.</p>
              </div>
            </div>
            {hasTiers ? (
              <div className="mt-6 grid gap-3 xl:grid-cols-3">
                {tiers.map((tier) => {
                  const active = selectedTier?.id === tier.id;
                  return (
                    <button
                      type="button"
                      key={tier.id}
                      aria-pressed={active}
                      onClick={() => {
                        setTierId(tier.id);
                        setError(null);
                      }}
                      className={cn(
                        "group flex min-h-[310px] flex-col border p-5 text-left transition duration-300",
                        active
                          ? "border-[#11110f] bg-[#11110f] text-white shadow-[0_18px_45px_rgba(17,17,15,0.18)]"
                          : "border-black/10 bg-white/40 text-[#11110f] hover:-translate-y-1 hover:border-black/35 hover:bg-white/80"
                      )}
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span>
                          <span className={cn("font-mono text-[8px] uppercase tracking-[0.2em]", active ? "text-white/40" : "text-black/35")}>
                            {tier.popular ? "Самый популярный" : tier.id === "basic" ? "Для старта" : "Максимум выбора"}
                          </span>
                          <span className="mt-3 block font-display text-2xl font-semibold tracking-[-0.05em]">{tier.name}</span>
                        </span>
                        <span
                          className={cn(
                            "flex h-7 w-7 items-center justify-center border transition",
                            active ? "border-white/30 bg-white text-black" : "border-black/15 group-hover:border-black"
                          )}
                        >
                          {active ? <Check className="h-3.5 w-3.5" /> : null}
                        </span>
                      </span>

                      <span className={cn("mt-2 block text-xs leading-5", active ? "text-white/48" : "text-black/45")}>{tier.tagline}</span>
                      <span className="mt-5 block font-display text-4xl font-semibold tracking-[-0.07em]">{tier.priceLabel}</span>
                      <span className={cn("mt-1 block font-mono text-[7px] uppercase tracking-[0.18em]", active ? "text-white/30" : "text-black/30")}>
                        разовый платёж
                      </span>

                      <span className={cn("mt-5 block border-t pt-4 text-sm font-medium", active ? "border-white/12" : "border-black/10")}>
                        {tier.expectedCount} фото · {tier.styleKeys.length} {pluralRu(tier.styleKeys.length, "стиль", "стиля", "стилей")} · {tier.imagesPerStyle} на стиль
                      </span>
                      <span className="mt-4 space-y-2">
                        {tier.features.slice(0, 3).map((feature) => (
                          <span key={feature} className={cn("flex items-start gap-2 text-[11px] leading-4", active ? "text-white/55" : "text-black/48")}>
                            <Check className="mt-0.5 h-3 w-3 shrink-0" />
                            {feature}
                          </span>
                        ))}
                      </span>
                      <span className={cn("mt-auto flex items-center justify-between border-t pt-4 font-mono text-[8px] uppercase tracking-[0.18em]", active ? "border-white/12 text-white" : "border-black/10 text-black/45")}>
                        {active ? "Выбран" : "Выбрать набор"}
                        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                      </span>
                    </button>
                  );
                })}
              </div>
            ) : (
              <p className="mt-6 border border-red-900/15 bg-red-50 p-4 text-sm text-red-700">
                Наборы временно недоступны для оплаты. Попробуйте немного позже.
              </p>
            )}
          </section>

          <section className="mt-14">
            <div className="flex items-center gap-4 border-b border-black/10 pb-5">
              <span className="font-mono text-[9px] tracking-[0.2em] text-black/30">02</span>
              <div className="flex-1">
                <h2 className="font-display text-2xl font-semibold tracking-[-0.05em]">Какие стили вы получите</h2>
                <p className="mt-1 text-xs leading-5 text-black/45">
                  {selectedTier
                    ? `В набор «${selectedTier.name}» входят отмеченные стили.`
                    : "Выберите набор выше — сразу увидите, какие стили входят."}
                </p>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {DISPLAY_STYLES.map((style) => {
                const included = selectedTier?.styleKeys.includes(style.key) ?? false;
                return (
                  <article
                    key={style.key}
                    className={cn(
                      "overflow-hidden border transition duration-300",
                      !selectedTier
                        ? "border-black/10 bg-white/35"
                        : included
                          ? "border-black/25 bg-white shadow-[0_14px_30px_rgba(17,17,15,0.08)]"
                          : "border-black/5 bg-black/[0.025] opacity-35"
                    )}
                  >
                    <div className="relative aspect-[5/6] bg-[#d5d5cf]">
                      <Image src={style.photo} alt={`${style.name} — пример стиля`} fill className="object-contain" sizes="(max-width: 640px) 50vw, 220px" />
                      <span
                        className={cn(
                          "absolute left-2 top-2 border px-2 py-1 font-mono text-[7px] uppercase tracking-[0.14em] backdrop-blur",
                          included
                            ? "border-white/20 bg-black/75 text-white"
                            : "border-black/10 bg-[#edede7]/85 text-black/50"
                        )}
                      >
                        {selectedTier ? (included ? "Входит" : "Не входит") : "Стиль"}
                      </span>
                    </div>
                    <div className="p-3">
                      <h3 className="font-display text-base font-semibold tracking-[-0.035em]">{style.name}</h3>
                      <p className="mt-1 text-[10px] leading-4 text-black/42">{style.tagline}</p>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          <section className="mt-14">
            <div className="flex items-center gap-4 border-b border-black/10 pb-5">
              <span className="font-mono text-[9px] tracking-[0.2em] text-black/30">03</span>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.05em]">Куда отправить результат</h2>
            </div>
            <label htmlFor="try-email" className="mt-6 block font-mono text-[8px] uppercase tracking-[0.22em] text-black/40">
              Email
            </label>
            <input
              id="try-email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="вы@почта.рф"
              className="mt-3 min-h-[58px] w-full border border-black/10 bg-white/65 px-5 text-base text-[#11110f] outline-none transition placeholder:text-black/25 focus:border-black/35 focus:bg-white"
            />
            <p className="mt-2 text-xs text-black/38">Аккаунт не нужен. На этот адрес придёт ссылка на галерею.</p>
          </section>

          <section className="mt-14">
            <div className="flex items-center gap-4 border-b border-black/10 pb-5">
              <span className="font-mono text-[9px] tracking-[0.2em] text-black/30">04</span>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.05em]">Подготовьте селфи</h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="border border-black/10 bg-white/45 p-5">
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-black/40">Подойдёт</p>
                <ul className="mt-4 space-y-3">
                  {TIPS_GOOD.slice(0, 4).map((text) => (
                    <li key={text} className="flex items-start gap-3 text-xs leading-5 text-black/52">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-black" />
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-black/10 bg-white/20 p-5">
                <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-black/40">Не подойдёт</p>
                <ul className="mt-4 space-y-3">
                  {TIPS_BAD.map((text) => (
                    <li key={text} className="flex items-start gap-3 text-xs leading-5 text-black/52">
                      <span className="mt-0.5 text-black/35">×</span>
                      {text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-black/40">Загрузка</p>
                <p className="mt-2 text-sm font-medium">Добавьте от 8 до 20 фотографий</p>
              </div>
              <span className="font-mono text-[9px] tracking-[0.18em] text-black/35">{files.length}/20</span>
            </div>
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
                "mt-4 flex min-h-[210px] cursor-pointer flex-col items-center justify-center border border-dashed px-5 py-10 text-center transition",
                isDragging
                  ? "border-black bg-white"
                  : "border-black/20 bg-white/35 hover:border-black/45 hover:bg-white/65"
              )}
            >
              <span className="flex h-12 w-12 items-center justify-center border border-black/10 bg-white/70 text-black">
                <Upload className="h-4 w-4" aria-hidden />
              </span>
              <span className="mt-5 font-display text-xl font-semibold tracking-[-0.04em]">Перетащите фото сюда</span>
              <span className="mt-2 text-xs text-black/40">или нажмите для выбора · JPG, PNG, WebP, HEIC</span>
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

            {processing && (
              <p className="mt-3 flex items-center gap-2 text-xs text-black/45">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Обрабатываем фото…
              </p>
            )}

            {files.length > 0 && (
              <div className="mt-5">
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-5">
                  {previews.map((url, idx) => (
                    <PreviewTile
                      key={url}
                      url={url}
                      index={idx}
                      onRemove={() => setFiles((prev) => prev.filter((_, i) => i !== idx))}
                    />
                  ))}
                </div>
                <p className="mt-3 text-xs text-black/45">
                  Выбрано {files.length}/20 фото
                  {files.length < 8 && ` · добавьте ещё ${8 - files.length}, чтобы продолжить`}
                </p>
              </div>
            )}
          </section>

          <section className="mt-12">
            <div className="flex items-center gap-4 border-b border-black/10 pb-5">
              <span className="font-mono text-[9px] tracking-[0.2em] text-black/30">05</span>
              <h2 className="font-display text-2xl font-semibold tracking-[-0.05em]">Проверьте заказ и оплатите</h2>
            </div>

            <div className="mt-5 border border-black/10 bg-white/45 p-5">
              {selectedTier ? (
                <>
                  <div className="flex items-start justify-between gap-5 border-b border-black/10 pb-4">
                    <div>
                      <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-black/35">Выбранный набор</p>
                      <p className="mt-2 font-display text-2xl font-semibold tracking-[-0.05em]">{selectedTier.name}</p>
                      <p className="mt-1 text-xs text-black/45">{selectedTier.tagline}</p>
                    </div>
                    <p className="font-display text-3xl font-semibold tracking-[-0.06em]">{selectedTier.priceLabel}</p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:grid-cols-3">
                    <p><span className="block font-mono text-[7px] uppercase tracking-[0.18em] text-black/35">Результат</span><span className="mt-1 block font-medium">{selectedTier.expectedCount} фото</span></p>
                    <p><span className="block font-mono text-[7px] uppercase tracking-[0.18em] text-black/35">Стили</span><span className="mt-1 block font-medium">{selectedTier.styleKeys.length} {pluralRu(selectedTier.styleKeys.length, "стиль", "стиля", "стилей")}</span></p>
                    <p><span className="block font-mono text-[7px] uppercase tracking-[0.18em] text-black/35">Оплата</span><span className="mt-1 block font-medium">Разовая, картой</span></p>
                  </div>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => document.getElementById("choose")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                  className="flex w-full items-center justify-between gap-5 text-left"
                >
                  <span>
                    <span className="font-display text-xl font-semibold tracking-[-0.04em]">Набор ещё не выбран</span>
                    <span className="mt-1 block text-xs text-black/45">Вернитесь к первому шагу и выберите подходящий вариант.</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0" />
                </button>
              )}
            </div>

            <PhotoProcessingConsentFields value={consent} onChange={setConsent} className="mt-5" />

            {error && (
              <p className="mt-5 border border-red-900/15 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type={selectedTier ? "submit" : "button"}
              onClick={
                selectedTier
                  ? undefined
                  : () => document.getElementById("choose")?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              disabled={loading}
              className="mt-6 inline-flex min-h-[58px] w-full items-center justify-center bg-[#11110f] px-6 font-mono text-[10px] uppercase tracking-[0.18em] text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {uploadProgress ?? "Готовим оплату…"}
                </>
              ) : (
                selectedTier ? `Перейти к оплате · ${priceLabel}` : "Сначала выберите набор"
              )}
            </button>
            <p className="mt-3 text-center text-xs text-black/38">
              {selectedTier
                ? `Разовый платёж · ${photoCount} фото в ${styleCount} стилях · оплата картой`
                : "После выбора набора здесь появится точный состав заказа"}
            </p>
          </section>
        </div>
      </form>
    </div>
  );
}
