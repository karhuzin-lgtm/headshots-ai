import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { BrandMark } from "@/components/site/brand-mark";

export const metadata = {
  title: "Страница не найдена — Headshots",
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-[#11110f] px-5 py-6 text-white sm:px-8">
      <BrandMark light />
      <div className="mx-auto flex w-full max-w-5xl flex-1 items-center">
        <div className="border-l border-white/20 pl-6 sm:pl-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/40">Ошибка / 404</p>
          <h1 className="mt-6 max-w-2xl font-display text-5xl font-medium tracking-[-0.065em] sm:text-7xl">
          Страница не найдена
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-white/50">
          Возможно, ссылка устарела или была введена с ошибкой. Проверьте адрес или вернитесь на главную.
        </p>
        <Link
          href="/"
          className="group mt-9 inline-flex min-h-[50px] items-center gap-8 bg-white px-5 text-sm font-semibold text-black transition hover:bg-[#edede7]"
        >
          На главную <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
        </Link>
        </div>
      </div>
    </div>
  );
}
