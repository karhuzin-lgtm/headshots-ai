import Link from "next/link";

import { LegalPageFooter } from "@/components/legal/legal-page-footer";

export const metadata = {
  title: "Legal Notice — Headshots",
  description: "Legal information and site operator details for Headshots.",
};

export default function LegalPage() {
  return (
    <div className="min-h-dvh bg-white text-[#111827]">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-5 sm:px-6">
          <Link href="/" className="font-display text-lg font-semibold tracking-tight">
            Headshots
          </Link>
          <Link href="/" className="text-sm text-gray-500 transition hover:text-gray-900">
            ← Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16">
        <h1 className="font-display text-4xl font-normal tracking-tight">Legal Notice</h1>
        <p className="mt-3 text-sm text-gray-500">Last updated: May 2026</p>

        <div className="mt-10 space-y-10 text-base leading-relaxed text-gray-600">
          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Site operator</h2>
            <p className="mt-3">
              This website is operated by <strong className="text-gray-900">Aleksei Media</strong>, an
              independent media and software business based in Valencia, Spain.
            </p>
            <ul className="mt-3 list-none space-y-1">
              <li>
                <span className="text-gray-500">Contact email:</span>{" "}
                <a
                  href="mailto:aleksei@alekseimedia.com"
                  className="font-medium text-[#111827] underline underline-offset-4"
                >
                  aleksei@alekseimedia.com
                </a>
              </li>
              <li>
                <span className="text-gray-500">Website:</span>{" "}
                <a
                  href="https://headshots.alekseimedia.com"
                  className="font-medium text-[#111827] underline underline-offset-4"
                >
                  headshots.alekseimedia.com
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Purpose of the site</h2>
            <p className="mt-3">
              Headshots provides AI-generated professional portrait headshots from user-uploaded selfies. The
              service is currently in early access / waitlist phase. Features and pricing may change before
              general availability.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Applicable law</h2>
            <p className="mt-3">
              These pages are governed by the laws of Spain and, where applicable, European Union consumer
              and data protection law (including GDPR). For data processing details, see our{" "}
              <Link href="/privacy" className="font-medium text-[#111827] underline underline-offset-4">
                Privacy Policy
              </Link>
              . For service use, see our{" "}
              <Link href="/terms" className="font-medium text-[#111827] underline underline-offset-4">
                Terms of Service
              </Link>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Intellectual property</h2>
            <p className="mt-3">
              Site content, branding, and software are owned by Aleksei Media unless otherwise stated.
              Generated headshots belong to the user who uploaded the source photos, as described in the
              Terms of Service.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Dispute resolution</h2>
            <p className="mt-3">
              If you are an EU consumer, you may use the European Online Dispute Resolution platform at{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                className="font-medium text-[#111827] underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                ec.europa.eu/consumers/odr
              </a>
              . We encourage you to contact us first at{" "}
              <a
                href="mailto:aleksei@alekseimedia.com"
                className="font-medium text-[#111827] underline underline-offset-4"
              >
                aleksei@alekseimedia.com
              </a>{" "}
              so we can resolve issues directly.
            </p>
          </section>
        </div>
      </main>

      <LegalPageFooter />
    </div>
  );
}
