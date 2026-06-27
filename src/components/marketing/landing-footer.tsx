import Link from "next/link";

import { BrandMark } from "@/components/site/brand-mark";
import { SUPPORT_TELEGRAM_URL } from "@/lib/landing-config";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-[#090909] px-5 py-10 text-white sm:px-7">
      <div className="mx-auto flex max-w-[1500px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <BrandMark light />
          <p className="mt-5 text-xs font-light text-white/35">Профессиональные AI-портреты из ваших селфи.</p>
        </div>
        <div className="flex flex-wrap gap-x-7 gap-y-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
          <Link href="/privacy" className="transition hover:text-white">
            Конфиденциальность
          </Link>
          <Link href="/terms" className="transition hover:text-white">
            Условия
          </Link>
          <Link href="/legal" className="transition hover:text-white">
            Реквизиты
          </Link>
          <a
            href={SUPPORT_TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
          >
            Поддержка в Telegram
          </a>
          <a href="mailto:aleksei@alekseimedia.com" className="transition hover:text-white">
            Контакт
          </a>
        </div>
      </div>
      <p className="mx-auto mt-10 max-w-[1500px] font-mono text-[8px] uppercase tracking-[0.2em] text-white/20">
        © 2026 Aleksei Media
      </p>
    </footer>
  );
}
