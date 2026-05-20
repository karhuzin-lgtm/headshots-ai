import Link from "next/link";

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
              Headshots is operated by Aleksei Media, Valencia, Spain. For privacy requests,
              contact{" "}
              <a
                href="mailto:aleksei@alekseimedia.com"
                className="font-medium text-[#111827] underline underline-offset-4"
              >
                aleksei@alekseimedia.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Data we collect</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>Your email address when you join the waitlist or create an account</li>
              <li>Uploaded photos (typically 8–20 selfies) when you use generation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">How we use your data</h2>
            <p className="mt-3">
              Your photos are used to train a private AI model on your face only — to generate
              your professional headshots. We do not use your photos to train models for other
              users, and we do not sell or share your data with third parties for marketing.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Retention</h2>
            <p className="mt-3">
              Uploaded photos and the AI model trained on your face are automatically deleted
              after 30 days. Waitlist email addresses are kept until you unsubscribe or request
              deletion.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Your rights under GDPR</h2>
            <p className="mt-3">
              If you are in the European Union (or UK), you have the right to access, rectify,
              delete, and port your personal data, and to object to or restrict certain processing.
              To exercise these rights, email{" "}
              <a
                href="mailto:aleksei@alekseimedia.com"
                className="font-medium text-[#111827] underline underline-offset-4"
              >
                aleksei@alekseimedia.com
              </a>
              . We will respond within the timeframes required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Cookies</h2>
            <p className="mt-3">
              We use essential cookies only — those required for the site to function (for
              example, session and security). We do not use advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#111827]">Changes</h2>
            <p className="mt-3">
              We may update this policy from time to time. The &quot;Last updated&quot; date at
              the top of this page will reflect the latest version.
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
