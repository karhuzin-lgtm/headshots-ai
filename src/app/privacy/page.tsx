import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Headshots",
  description: "How Headshots handles your email, photos, and personal data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-[#080808] px-5 py-16 text-[#f5f5f5] sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-[#888] transition hover:text-[#f5f5f5]">
          ← Back to home
        </Link>
        <h1 className="mt-8 font-display text-4xl font-normal tracking-tight">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-[#888]">Last updated: May 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-[#888]">
          <section>
            <h2 className="text-lg font-medium text-[#f5f5f5]">What we collect</h2>
            <p className="mt-3">
              When you join the waitlist, we collect your email address. When you use generation,
              we collect the photos you upload to train a private model for your headshots.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-[#f5f5f5]">How we use your data</h2>
            <p className="mt-3">
              Your email is used to notify you about early access and product updates. Your photos
              are used only to train your personal AI model and generate your headshots. We do not
              sell your data or use your photos to train models for other users.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-[#f5f5f5]">Retention</h2>
            <p className="mt-3">
              Uploaded photos and the trained model are automatically deleted after 30 days.
              Waitlist emails are retained until you unsubscribe or request deletion.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-[#f5f5f5]">Contact</h2>
            <p className="mt-3">
              Questions about privacy? Email{" "}
              <a
                href="mailto:aleksei@alekseimedia.com"
                className="text-[#f5f5f5] underline underline-offset-4"
              >
                aleksei@alekseimedia.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
