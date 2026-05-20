import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Headshots",
  description: "Terms of use for Headshots AI professional headshot generation.",
};

export default function TermsPage() {
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
        <h1 className="font-display text-4xl font-normal tracking-tight">Terms of Service</h1>
        <p className="mt-3 text-sm text-gray-500">Last updated: May 2026</p>

        <div className="mt-10 space-y-10 text-base leading-relaxed text-gray-600">
          <section>
            <h2 className="text-lg font-semibold text-[#111827]">The service</h2>
            <p className="mt-3">
              Headshots provides AI-generated professional headshots from photos you upload. During
              the waitlist and beta period, access and features may change as we improve the
              product.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Your photos</h2>
            <p className="mt-3">
              You must upload only photos of yourself (or someone you are legally authorized to
              represent). Do not upload third-party faces without their explicit consent. You are
              responsible for ensuring you have the right to use the images you submit.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Ownership</h2>
            <p className="mt-3">
              You own 100% of the headshots generated for you. You may use them for LinkedIn,
              websites, business cards, press, and any other personal or commercial purpose.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Eligibility</h2>
            <p className="mt-3">You must be at least 18 years old to use Headshots.</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Pricing during waitlist</h2>
            <p className="mt-3">
              Headshots is in free beta while we onboard waitlist members. No payment is required
              during the waitlist period. Paid plans and pricing will be communicated before any
              charge is made.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Refund policy at launch</h2>
            <p className="mt-3">
              When paid generation launches: if you receive fewer than five headshots you would
              actually use on LinkedIn (or equivalent professional use), contact us within 14
              days — we will retrain your model at no extra cost or issue a full refund.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Acceptable use</h2>
            <p className="mt-3">
              You may not use the service for illegal purposes, impersonation, non-consensual
              deepfakes, or content that violates applicable law. We may suspend access for abuse.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Contact</h2>
            <p className="mt-3">
              Questions about these terms? Email{" "}
              <a
                href="mailto:aleksei@alekseimedia.com"
                className="font-medium text-[#111827] underline underline-offset-4"
              >
                aleksei@alekseimedia.com
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-gray-100 bg-gray-50 py-8 text-center text-xs text-gray-500">
        © 2026 Aleksei Media. All rights reserved.
      </footer>
    </div>
  );
}
