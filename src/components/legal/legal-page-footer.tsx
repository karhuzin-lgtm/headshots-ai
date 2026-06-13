import Link from "next/link";

import { BrandMark } from "@/components/site/brand-mark";

export function LegalPageFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#11110f] py-10 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-8">
        <div>
          <BrandMark light />
          <p className="mt-5 max-w-xs text-xs leading-relaxed text-white/45">
            © 2026 Aleksei Media. Портреты нового поколения, созданные для реального использования.
          </p>
        </div>
        <nav className="flex max-w-md flex-wrap gap-x-5 gap-y-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/50 sm:justify-end">
          <Link href="/" className="transition hover:text-white">
            Студия
          </Link>
          <Link href="/privacy" className="transition hover:text-white">
            Конфиденциальность
          </Link>
          <Link href="/terms" className="transition hover:text-white">
            Условия
          </Link>
          <Link href="/legal" className="transition hover:text-white">
            Реквизиты
          </Link>
          <a href="mailto:aleksei@alekseimedia.com" className="transition hover:text-white">
            Контакт
          </a>
        </nav>
      </div>
    </footer>
  );
}
