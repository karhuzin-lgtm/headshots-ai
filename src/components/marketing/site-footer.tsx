import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-[color:var(--border)] bg-white">
      <div className="mx-auto flex max-w-[1400px] flex-col gap-10 px-4 py-14 sm:flex-row sm:items-start sm:justify-between sm:py-16 md:px-6 lg:px-10">
        <div className="max-w-sm">
          <p className="font-display text-2xl font-semibold tracking-tight text-foreground">
            Headshots
          </p>
          <p className="mt-4 text-sm leading-relaxed tracking-tight text-muted-foreground">
            Editorial-grade AI portraits for people who care how they show up online — built with
            European privacy expectations in mind.
          </p>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-4 text-sm font-medium tracking-tight text-muted-foreground">
          <Link href="/upload" className="transition hover:text-foreground">
            Upload
          </Link>
          <Link href="/#examples" className="transition hover:text-foreground">
            Examples
          </Link>
          <Link href="/#pricing" className="transition hover:text-foreground">
            Pricing
          </Link>
          <Link href="/#faq" className="transition hover:text-foreground">
            FAQ
          </Link>
        </div>
      </div>
      <div className="border-t border-[color:var(--border)] py-6 text-center text-xs tracking-tight text-muted-foreground/80">
        © {new Date().getFullYear()} Headshots. All rights reserved.
      </div>
    </footer>
  );
}
