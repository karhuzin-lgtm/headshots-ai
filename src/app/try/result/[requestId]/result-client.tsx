"use client";

import { Loader2 } from "lucide-react";
import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";

import { DISPLAY_STYLES } from "@/lib/display-styles";
import { PRICE_LABEL, PRIMARY_CTA, STYLE_COUNT } from "@/lib/landing-config";

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

  // Ждём подтверждения оплаты от вебхука LavaTop. Пользователь только что
  // вернулся со страницы оплаты — это занимает несколько секунд.
  if (status?.awaitingPayment) {
    return (
      <div className="px-5 py-20 sm:py-28">
        <StatusCard>
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#c9a96e]" />
          <h1 className="mt-8 font-display text-2xl font-normal tracking-tight text-[#111827] sm:text-3xl">
            Подтверждаем оплату
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            Это занимает несколько секунд. Как только платёж подтвердится, мы
            автоматически запустим генерацию — страница обновится сама.
          </p>
          <p className="mt-2 text-sm text-gray-500">Не закрывайте эту вкладку.</p>
          {status.paymentUrl ? (
            <p className="mt-8 text-xs text-gray-400">
              Не завершили оплату?{" "}
              <a
                href={status.paymentUrl}
                className="font-medium text-[#9a7b4f] underline-offset-2 hover:underline"
              >
                Оплатить {PRICE_LABEL}
              </a>
            </p>
          ) : null}
        </StatusCard>
      </div>
    );
  }

  if (timedOut && (!status || status.status === "pending" || status.status === "processing")) {
    return (
      <div className="px-5 py-20 sm:py-28">
        <StatusCard>
          <h1 className="font-display text-2xl font-normal tracking-tight text-[#111827] sm:text-3xl">
            Дольше, чем обычно
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            Проверьте почту — мы пришлём результат, как только он будет готов.
          </p>
        </StatusCard>
      </div>
    );
  }

  // Only show the error screen if we never got a status. A transient poll failure
  // (network blip, tab woke from sleep during the ~20-min wait) must NOT blank out
  // the progress screen — we keep showing progress and retry on the next tick.
  if (error && !status) {
    return (
      <div className="px-5 py-20 sm:py-28">
        <StatusCard>
          <h1 className="font-display text-2xl font-normal tracking-tight text-[#111827]">Что-то пошло не так</h1>
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
            Создаём ваши портреты
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-gray-600">
            Обучение модели обычно занимает ~20 минут.
          </p>
          <p className="mt-2 text-sm text-gray-500">Можно закрыть вкладку — мы пришлём письмо, когда всё будет готово.</p>
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
          <h1 className="font-display text-2xl font-normal tracking-tight text-[#111827]">Не удалось сгенерировать</h1>
          <p className="mt-4 text-sm text-gray-600">{status.error ?? "Попробуйте ещё раз позже."}</p>
          <p className="mt-6 text-xs text-gray-400">
            Если вы оплатили заказ, напишите нам — поможем без повторной оплаты.
          </p>
        </StatusCard>
      </div>
    );
  }

  // Astria delivers images via independent per-prompt callbacks that arrive in
  // arbitrary order and are merged as a flat set, so we can't reliably map a
  // position back to a style. Show one honest gallery rather than mislabeled
  // per-style sections.
  const styleCount = status.styleKeys?.length || DISPLAY_STYLES.length;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:py-20">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7b4f]">Готово</p>
        <h1 className="mt-4 font-display text-4xl font-normal tracking-tight text-[#111827] sm:text-5xl">
          Ваши портреты готовы
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-gray-600">
          {outputUrls.length} фото в {styleCount} стилях · высокое разрешение · ваши навсегда
        </p>
      </div>

      {outputUrls.length > 0 && (
        <div className="mt-12 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {outputUrls.map((imageUrl, i) => {
            const filename = `portret-${i + 1}.jpg`;
            return (
              <div
                key={imageUrl}
                className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-2 shadow-sm"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={`AI-портрет ${i + 1}`}
                  className="aspect-[3/4] w-full rounded-xl object-cover object-top"
                />
                <a
                  href={downloadHref(imageUrl, filename)}
                  className="mt-2 flex w-full items-center justify-center rounded-lg py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-[#faf8f5] hover:text-[#111827]"
                >
                  ↓ Скачать
                </a>
              </div>
            );
          })}
        </div>
      )}

      <div className="mx-auto mt-14 max-w-md rounded-2xl border border-gray-200/80 bg-white p-6 text-center shadow-sm">
        <p className="text-sm text-gray-600">Нужны другие образы? Сделайте ещё один набор в {STYLE_COUNT} стилях.</p>
        <Link
          href={PRIMARY_CTA.href}
          className="mt-4 inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#111827] text-sm font-semibold text-white transition hover:bg-black"
        >
          {PRIMARY_CTA.label}
        </Link>
      </div>
    </div>
  );
}
