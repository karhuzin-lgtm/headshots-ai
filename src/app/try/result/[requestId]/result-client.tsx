"use client";

import { ArrowRight, Check, Download, ExternalLink, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";

import { DISPLAY_STYLES } from "@/lib/display-styles";
import { PRICE_LABEL, PRIMARY_CTA, STYLE_COUNT, SUPPORT_TELEGRAM_URL } from "@/lib/landing-config";
import { getTier } from "@/lib/tiers";

type StatusResponse = {
  id?: string;
  status?: "pending" | "processing" | "done" | "failed";
  imageUrl?: string;
  outputUrls?: string[];
  error?: string;
  paid?: boolean;
  awaitingPayment?: boolean;
  paymentUrl?: string | null;
  tier?: string;
  expectedCount?: number;
  styleKeys?: string[];
};

function downloadHref(url: string, filename: string): string {
  const params = new URLSearchParams({ url, filename });
  return `/api/download-image?${params.toString()}`;
}

function StatusCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative mx-auto max-w-2xl border border-white/15 bg-[#171714]/90 px-6 py-12 text-center shadow-2xl backdrop-blur-xl sm:px-12 sm:py-16 ${className ?? ""}`}
    >
      {children}
    </div>
  );
}

function StatusShell({ children }: { children: ReactNode }) {
  return <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-24">{children}</div>;
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
  const paymentPriceLabel = status?.tier ? getTier(status.tier).priceLabel : PRICE_LABEL;

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
        if (!res.ok) throw new Error(json.error ?? "Не удалось загрузить статус.");
        if (!cancelled) {
          setStatus(json);
          setError(null);
        }
        return json.status === "done" || json.status === "failed";
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Не удалось загрузить статус.");
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

  // Оплата открывается по кнопке в отдельной вкладке (у LavaTop нет редиректа
  // назад). Эта страница опрашивает статус и сама переключится на генерацию
  // после оплаты.
  if (status?.awaitingPayment) {
    return (
      <StatusShell>
        <StatusCard>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">Заказ создан</p>
          <h1 className="mt-5 font-display text-4xl font-medium tracking-[-0.05em] text-white sm:text-5xl">
            Завершите оплату
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/55">
            Нажмите «Оплатить», чтобы перейти к оплате в новой вкладке. После
            оплаты эта страница сама переключится на создание портретов.
          </p>
          {status.paymentUrl ? (
            <a
              href={status.paymentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group mx-auto mt-9 inline-flex min-h-[54px] w-full max-w-sm items-center justify-between bg-white px-5 text-sm font-semibold text-black transition hover:bg-[#edede7]"
            >
              <span>Оплатить {paymentPriceLabel}</span>
              <ExternalLink className="h-4 w-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          ) : (
            <p className="mx-auto mt-9 text-xs text-white/40">Готовим оплату…</p>
          )}
          <div className="mt-7 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.12em] text-white/40">
            <Loader2 className="h-4 w-4 animate-spin text-white/60" />
            Ждём подтверждения оплаты…
          </div>
        </StatusCard>
      </StatusShell>
    );
  }

  if (timedOut && (!status || status.status === "pending" || status.status === "processing")) {
    return (
      <StatusShell>
        <StatusCard>
          <Mail className="mx-auto h-7 w-7 text-white/60" />
          <h1 className="mt-7 font-display text-4xl font-medium tracking-[-0.05em] text-white sm:text-5xl">
            Дольше, чем обычно
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/55">
            Проверьте почту — мы пришлём результат, как только он будет готов.
          </p>
          <a href={SUPPORT_TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-[48px] items-center gap-3 border border-white/20 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-black">
            Написать в поддержку <ArrowRight className="h-4 w-4" />
          </a>
        </StatusCard>
      </StatusShell>
    );
  }

  // Only show the error screen if we never got a status. A transient poll failure
  // (network blip, tab woke from sleep during the ~20-min wait) must NOT blank out
  // the progress screen — we keep showing progress and retry on the next tick.
  if (error && !status) {
    return (
      <StatusShell>
        <StatusCard>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">Ошибка статуса</p>
          <h1 className="mt-5 font-display text-4xl font-medium tracking-[-0.05em] text-white">Что-то пошло не так</h1>
          <p className="mt-5 text-sm text-white/55">{error}</p>
          <Link
            href="/try/generate"
            className="mt-8 inline-flex min-h-[48px] items-center gap-3 border border-white/20 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-black"
          >
            Вернуться к загрузке <ArrowRight className="h-4 w-4" />
          </Link>
          <a href={SUPPORT_TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-[48px] items-center gap-3 border border-white/20 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-black">
            Написать в поддержку <ArrowRight className="h-4 w-4" />
          </a>
        </StatusCard>
      </StatusShell>
    );
  }

  if (!status || status.status === "pending" || status.status === "processing") {
    return (
      <StatusShell>
        <StatusCard>
          <div className="mx-auto flex h-14 w-14 items-center justify-center border border-white/15">
            <Loader2 className="h-6 w-6 animate-spin text-white" />
          </div>
          <p className="mt-8 text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">
            Приватная студия работает
          </p>
          <h1 className="mt-5 font-display text-4xl font-medium tracking-[-0.05em] text-white sm:text-5xl">
            Создаём ваши портреты
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-white/55">
            Подбираем свет, фон и характер каждого кадра. Обычно это занимает около 20 минут.
          </p>
          <div className="mx-auto mt-8 flex max-w-md items-center justify-between border-t border-white/10 pt-5 text-[10px] uppercase tracking-[0.16em] text-white/35">
            <span>Обработка</span>
            <span>Письмо придёт автоматически</span>
          </div>
          <div className="mx-auto mt-4 h-px max-w-md overflow-hidden bg-white/10">
            <div className="h-full w-2/3 animate-pulse bg-white/70" />
          </div>
        </StatusCard>
      </StatusShell>
    );
  }

  if (status.status === "failed") {
    return (
      <StatusShell>
        <StatusCard>
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/45">Генерация остановлена</p>
          <h1 className="mt-5 font-display text-4xl font-medium tracking-[-0.05em] text-white">Не удалось сгенерировать</h1>
          <p className="mx-auto mt-5 max-w-md text-sm text-white/55">{status.error ?? "Попробуйте ещё раз позже."}</p>
          <p className="mx-auto mt-7 max-w-md border-t border-white/10 pt-5 text-xs leading-relaxed text-white/35">
            Если вы оплатили заказ, напишите нам — поможем без повторной оплаты.
          </p>
          <a href={SUPPORT_TELEGRAM_URL} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-[48px] items-center gap-3 border border-white/20 px-5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-white hover:text-black">
            Написать в поддержку <ArrowRight className="h-4 w-4" />
          </a>
        </StatusCard>
      </StatusShell>
    );
  }

  // Astria delivers images via independent per-prompt callbacks that arrive in
  // arbitrary order and are merged as a flat set, so we can't reliably map a
  // position back to a style. Show one honest gallery rather than mislabeled
  // per-style sections.
  const styleCount = status.styleKeys?.length || DISPLAY_STYLES.length;

  return (
    <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="grid gap-8 border-b border-white/15 pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <div className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/45">
            <span className="flex h-6 w-6 items-center justify-center border border-white/20">
              <Check className="h-3 w-3" />
            </span>
            Выпуск готов
          </div>
          <h1 className="mt-6 max-w-3xl font-display text-5xl font-medium tracking-[-0.065em] text-white sm:text-7xl">
            Ваши новые портреты.
          </h1>
        </div>
        <p className="max-w-xs text-sm leading-relaxed text-white/50 lg:text-right">
          {outputUrls.length} фото в {styleCount} стилях. Высокое разрешение, без ограничений на использование.
        </p>
      </div>

      {outputUrls.length > 0 && (
        <div className="mt-8 columns-1 gap-5 sm:columns-2 lg:columns-3 xl:columns-4">
          {outputUrls.map((imageUrl, i) => {
            const filename = `portret-${i + 1}.jpg`;
            return (
              <div
                key={imageUrl}
                className="group mb-8 break-inside-avoid"
              >
                <div className="relative overflow-hidden border border-white/10 bg-white/[0.035] shadow-[0_18px_45px_rgba(0,0,0,0.2)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={`AI-портрет ${i + 1}`}
                    className="h-auto w-full transition duration-700 group-hover:opacity-90"
                  />
                  <span className="absolute left-3 top-3 bg-[#11110f]/75 px-2 py-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <a
                  href={downloadHref(imageUrl, filename)}
                  className="mt-3 flex w-full items-center justify-between border-t border-white/15 pt-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/55 transition hover:text-white"
                >
                  Скачать <Download className="h-3.5 w-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-20 grid gap-8 border-t border-white/15 pt-10 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">Следующий выпуск</p>
          <p className="mt-3 max-w-lg font-display text-3xl font-medium tracking-[-0.04em] text-white">
            Нужны другие образы? Соберите ещё один набор в {STYLE_COUNT} стилях.
          </p>
        </div>
        <Link
          href={PRIMARY_CTA.href}
          className="group inline-flex min-h-[52px] items-center justify-between gap-8 bg-white px-5 text-sm font-semibold text-black transition hover:bg-[#edede7]"
        >
          {PRIMARY_CTA.label} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
