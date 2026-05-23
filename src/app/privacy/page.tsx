import Link from "next/link";

import { LegalPageFooter } from "@/components/legal/legal-page-footer";

export const metadata = {
  title: "Privacy Policy — Headshots",
  description: "How Headshots collects, uses, and protects your data under GDPR.",
};

export default function PrivacyPage() {
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
        <h1 className="font-display text-4xl font-normal tracking-tight">Privacy Policy</h1>
        <p className="mt-3 text-sm text-gray-500">Last updated: May 2026</p>

        <div className="mt-10 space-y-10 text-base leading-relaxed text-gray-600">
          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Who we are</h2>
            <p className="mt-3">
              Headshots is operated by <strong className="text-gray-900">Aleksei Media</strong>, Valencia,
              Spain. We are the data controller for personal data collected through this website.
            </p>
            <p className="mt-3">
              Privacy requests:{" "}
              <a
                href="mailto:aleksei@alekseimedia.com"
                className="font-medium text-[#111827] underline underline-offset-4"
              >
                aleksei@alekseimedia.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Data we collect</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Email address when you join the waitlist or use generation</li>
              <li>Uploaded photos (typically 8–20 selfies) when you use headshot generation</li>
              <li>Technical data required to operate the service (e.g. session cookies if you sign in)</li>
              <li>Optional marketing consent preference for waitlist emails</li>
            </ul>
            <p className="mt-3">
              Facial photos may constitute special category data under GDPR. We process them only with your
              explicit consent when you upload photos for generation.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Legal basis for processing</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong className="text-gray-900">Waitlist email:</strong> your consent when you tick the
                checkbox and submit the form
              </li>
              <li>
                <strong className="text-gray-900">Product / early-access emails:</strong> your consent where
                you opt in to marketing updates (optional checkbox)
              </li>
              <li>
                <strong className="text-gray-900">Photo processing &amp; AI generation:</strong> your explicit
                consent before upload
              </li>
              <li>
                <strong className="text-gray-900">Service delivery emails</strong> (e.g. results ready):
                necessary to perform the service you requested
              </li>
              <li>
                <strong className="text-gray-900">Essential cookies:</strong> legitimate interest in secure
                site operation
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">How we use your data</h2>
            <p className="mt-3">
              Your photos are used to train a private AI model on your face and generate your professional
              headshots. We do not use your photos to train models for other users. We do not sell your
              personal data.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Service providers (processors)</h2>
            <p className="mt-3">
              We use trusted infrastructure providers to run the service. They process data only on our
              instructions:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Vercel — hosting and file storage</li>
              <li>Neon — database</li>
              <li>Resend — transactional email</li>
              <li>Astria — AI model training and image generation</li>
              <li>Stripe — payment processing (when paid plans are active)</li>
              <li>Supabase / Google — authentication (where sign-in is used)</li>
            </ul>
            <p className="mt-3">
              Some providers may process data in the United States or other countries outside the EEA. Where
              required, we rely on appropriate safeguards such as Standard Contractual Clauses.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Retention</h2>
            <p className="mt-3">
              Uploaded photos and the AI model trained on your face are kept for up to <strong>30 days</strong>{" "}
              after generation, then deleted. You may request earlier deletion at any time.
            </p>
            <p className="mt-3">
              Waitlist email addresses are kept until you unsubscribe or request deletion. Consent records
              are kept as long as needed to demonstrate compliance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Your rights under GDPR</h2>
            <p className="mt-3">
              If you are in the EU, UK, or another jurisdiction with similar rights, you may:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Access, rectify, or delete your personal data</li>
              <li>Export your data (portability)</li>
              <li>Object to or restrict certain processing</li>
              <li>Withdraw consent at any time (without affecting prior lawful processing)</li>
              <li>Lodge a complaint with a supervisory authority</li>
            </ul>
            <p className="mt-3">
              In Spain, the supervisory authority is the{" "}
              <strong className="text-gray-900">Agencia Española de Protección de Datos (AEPD)</strong> —{" "}
              <a
                href="https://www.aepd.es"
                className="font-medium text-[#111827] underline underline-offset-4"
                target="_blank"
                rel="noopener noreferrer"
              >
                aepd.es
              </a>
              .
            </p>
            <p className="mt-3">
              To exercise your rights, email{" "}
              <a
                href="mailto:aleksei@alekseimedia.com"
                className="font-medium text-[#111827] underline underline-offset-4"
              >
                aleksei@alekseimedia.com
              </a>
              . We respond within the timeframes required by applicable law.
            </p>
            <p className="mt-3">
              Waitlist unsubscribe: email us or use{" "}
              <Link href="/api/waitlist/unsubscribe" className="font-medium text-[#111827] underline underline-offset-4">
                our unsubscribe endpoint
              </Link>{" "}
              with your email address.
            </p>
          </section>

          <section id="cookies">
            <h2 className="text-lg font-semibold text-[#111827]">Cookies</h2>
            <p className="mt-3">
              We use <strong>essential cookies only</strong> — those required for the site to function (session
              and security, including authentication where enabled). We do not use advertising or analytics
              tracking cookies.
            </p>
            <p className="mt-3">
              You can control cookies through your browser settings. Blocking essential cookies may prevent
              some features from working.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Children</h2>
            <p className="mt-3">
              Headshots is not intended for anyone under 18. We do not knowingly collect data from minors.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Changes</h2>
            <p className="mt-3">
              We may update this policy from time to time. The &quot;Last updated&quot; date at the top reflects
              the latest version. Material changes will be communicated where appropriate.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Related documents</h2>
            <p className="mt-3">
              <Link href="/terms" className="font-medium text-[#111827] underline underline-offset-4">
                Terms of Service
              </Link>
              {" · "}
              <Link href="/legal" className="font-medium text-[#111827] underline underline-offset-4">
                Legal Notice
              </Link>
            </p>
          </section>
        </div>
      </main>

      <LegalPageFooter />
    </div>
  );
}
