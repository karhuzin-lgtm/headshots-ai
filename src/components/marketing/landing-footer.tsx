import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#080808] px-5 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="font-display text-lg font-semibold tracking-tight text-[#f5f5f5]">
            Headshots
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#888]">
            Studio-quality AI headshots from your selfies. Built by{" "}
            <a
              href="https://alekseimedia.com"
              className="text-[#f5f5f5] underline underline-offset-4 transition hover:text-white"
            >
              Aleksei Media
            </a>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-[#888]">
          <Link href="/privacy" className="transition hover:text-[#f5f5f5]">
            Privacy
          </Link>
          <Link href="/terms" className="transition hover:text-[#f5f5f5]">
            Terms
          </Link>
          <a
            href="mailto:aleksei@alekseimedia.com"
            className="transition hover:text-[#f5f5f5]"
          >
            aleksei@alekseimedia.com
          </a>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-7xl text-xs text-[#888]">
        © {new Date().getFullYear()} Aleksei Media. All rights reserved.
      </p>
    </footer>
  );
}
