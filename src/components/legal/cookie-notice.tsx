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
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-gray-200 bg-white/95 p-4 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md sm:p-5"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-gray-600">
          Мы используем только необходимые cookie (сессия и безопасность). Без рекламных и трекинговых cookie.{" "}
          <Link href="/privacy#cookies" className="font-medium text-gray-900 underline underline-offset-4">
            Подробнее
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-800"
        >
          Понятно
        </button>
      </div>
    </div>
  );
}
