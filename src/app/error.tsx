"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

import { BrandMark } from "@/components/site/brand-mark";

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
    <div className="flex min-h-dvh flex-col bg-[#11110f] px-5 py-6 text-white sm:px-8">
      <BrandMark light />
      <div className="mx-auto flex w-full max-w-5xl flex-1 items-center">
        <div className="border-l border-white/20 pl-6 sm:pl-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">Системная ошибка</p>
        <h1 className="mt-6 max-w-2xl font-display text-5xl font-medium tracking-[-0.065em] sm:text-7xl">
          Что-то пошло не так
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-white/50">
          Произошла непредвиденная ошибка. Попробуйте обновить страницу — обычно это помогает.
        </p>
        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-[50px] items-center justify-center bg-white px-6 text-sm font-semibold text-black transition hover:bg-[#edede7]"
          >
            Попробовать снова
          </button>
          <Link
            href="/"
            className="group inline-flex min-h-[50px] items-center justify-between gap-8 border border-white/20 px-5 text-sm font-semibold text-white transition hover:bg-white hover:text-black"
          >
            На главную <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
}
