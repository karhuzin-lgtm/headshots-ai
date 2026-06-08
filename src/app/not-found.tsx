import Link from "next/link";

export const metadata = {
  title: "Страница не найдена — Headshots",
};

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#faf8f5] px-5 py-20 text-[#111827]">
      <div className="mx-auto max-w-lg rounded-2xl border border-gray-200/80 bg-white px-8 py-12 text-center shadow-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9a7b4f]">404</p>
        <h1 className="mt-4 font-display text-3xl font-normal tracking-tight text-[#111827] sm:text-4xl">
          Страница не найдена
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-gray-600">
          Возможно, ссылка устарела или была введена с ошибкой. Проверьте адрес или вернитесь на главную.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#111827] px-7 text-sm font-semibold text-white transition hover:bg-black"
        >
          На главную
        </Link>
      </div>
    </div>
  );
}
