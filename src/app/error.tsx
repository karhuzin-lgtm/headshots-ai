"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#faf8f5] px-5 py-20 text-[#111827]">
      <div className="mx-auto max-w-lg rounded-2xl border border-gray-200/80 bg-white px-8 py-12 text-center shadow-lg">
        <h1 className="font-display text-3xl font-normal tracking-tight text-[#111827] sm:text-4xl">
          Что-то пошло не так
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-600">
          Произошла непредвиденная ошибка. Попробуйте обновить страницу — обычно это помогает.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#111827] px-7 text-sm font-semibold text-white transition hover:bg-black sm:w-auto"
          >
            Попробовать снова
          </button>
          <Link
            href="/"
            className="inline-flex min-h-[44px] w-full items-center justify-center rounded-full border border-gray-200 px-7 text-sm font-semibold text-[#111827] transition hover:bg-[#faf8f5] sm:w-auto"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}
