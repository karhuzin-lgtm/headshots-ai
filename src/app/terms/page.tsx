import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Headshots",
  description: "Terms of use for Headshots AI headshot generation.",
};

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-[#080808] px-5 py-16 text-[#f5f5f5] sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-[#888] transition hover:text-[#f5f5f5]">
          ← Back to home
        </Link>
        <h1 className="mt-8 font-display text-4xl font-normal tracking-tight">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-[#888]">Last updated: May 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-[#888]">
          <section>
            <h2 className="text-lg font-medium text-[#f5f5f5]">Service</h2>
            <p className="mt-3">
              Headshots provides AI-generated professional portraits from user-uploaded selfies.
              During early access, features and availability may change. The service is provided
              on an as-is basis while in beta.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-[#f5f5f5]">Your content</h2>
            <p className="mt-3">
              You retain ownership of photos you upload and headshots we generate for you. You
              agree to upload only photos you have the right to use and that depict you (or
              someone you are authorized to represent).
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-[#f5f5f5]">Acceptable use</h2>
            <p className="mt-3">
              You may not use the service for illegal purposes, impersonation, deepfakes of others
              without consent, or any content that violates applicable law.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-[#f5f5f5]">Refunds</h2>
            <p className="mt-3">
              If you are not satisfied with results and do not find at least five usable
              headshots, contact us within 14 days — we will retrain your model at no extra cost
              or issue a full refund per our satisfaction guarantee.
            </p>
          </section>
          <section>
            <h2 className="text-lg font-medium text-[#f5f5f5]">Contact</h2>
            <p className="mt-3">
              <a
                href="mailto:aleksei@alekseimedia.com"
                className="text-[#f5f5f5] underline underline-offset-4"
              >
                aleksei@alekseimedia.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
