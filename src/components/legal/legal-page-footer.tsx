import Link from "next/link";

export function LegalPageFooter() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50 py-8">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-5 text-center text-xs text-gray-500 sm:flex-row sm:justify-between sm:text-left">
        <p>© 2026 Aleksei Media. All rights reserved.</p>
        <nav className="flex flex-wrap justify-center gap-4">
          <Link href="/" className="transition hover:text-gray-900">
            Home
          </Link>
          <Link href="/privacy" className="transition hover:text-gray-900">
            Privacy
          </Link>
          <Link href="/terms" className="transition hover:text-gray-900">
            Terms
          </Link>
          <Link href="/legal" className="transition hover:text-gray-900">
            Legal notice
          </Link>
          <a href="mailto:aleksei@alekseimedia.com" className="transition hover:text-gray-900">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
}
