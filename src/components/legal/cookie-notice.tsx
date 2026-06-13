"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const STORAGE_KEY = "headshots-cookie-notice-v1";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Уведомление о cookie"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-2xl border border-black/10 bg-[#edede7]/95 p-3 shadow-[0_16px_60px_rgba(0,0,0,0.22)] backdrop-blur-xl sm:bottom-5"
    >
      <div className="mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11px] leading-relaxed text-gray-600 sm:text-xs">
          Мы используем только необходимые cookie (сессия и безопасность). Без рекламных и трекинговых cookie.{" "}
          <Link href="/privacy#cookies" className="font-medium text-gray-900 underline underline-offset-4">
            Подробнее
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex min-h-[40px] shrink-0 self-start items-center justify-center bg-[#11110f] px-5 text-xs font-semibold text-white transition hover:bg-black sm:self-auto"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
