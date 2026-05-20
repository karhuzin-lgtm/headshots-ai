import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Headshots",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-[#fafafa] px-5 py-16 text-[#0a0a0a] sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-neutral-500 hover:text-[#0a0a0a]">
          ← Back
        </Link>
        <h1 className="mt-8 text-4xl font-normal tracking-tight">Privacy Policy</h1>
        <p className="mt-6 text-sm leading-relaxed text-neutral-600">
          We collect your email for the waitlist and photos only when you use generation.
          Uploaded photos and trained models are deleted after 30 days. We do not sell your
          data. Contact{" "}
          <a href="mailto:aleksei@alekseimedia.com" className="underline">
            aleksei@alekseimedia.com
          </a>{" "}
          with questions.
        </p>
      </div>
    </div>
  );
}
