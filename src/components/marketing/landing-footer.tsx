import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white px-6 py-12">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-xl font-semibold tracking-tight text-[#111827]">Headshots</p>
          <p className="mt-2 text-sm text-gray-500">Профессиональные AI-портреты из ваших селфи.</p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          <Link href="/privacy" className="transition hover:text-gray-900">
            Конфиденциальность
          </Link>
          <Link href="/terms" className="transition hover:text-gray-900">
            Условия
          </Link>
          <Link href="/legal" className="transition hover:text-gray-900">
            Реквизиты
          </Link>
          <a href="mailto:aleksei@alekseimedia.com" className="transition hover:text-gray-900">
            Контакт
          </a>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-7xl text-xs text-gray-400">© 2026 Aleksei Media. Все права защищены.</p>
    </footer>
  );
}
