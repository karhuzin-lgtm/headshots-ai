import Link from "next/link";

export const metadata = {
  title: "Privacy Policy — Headshots",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh bg-[#080808] px-5 py-16 text-[#f5f5f5] sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-[#888] hover:text-[#f5f5f5]">
          ← Back
        </Link>
        <h1 className="mt-8 text-4xl font-normal tracking-tight">Privacy Policy</h1>
        <p className="mt-6 text-sm leading-relaxed text-[#888]">
          We collect your email for the waitlist and photos only when you use generation.
          Uploaded photos and trained models are deleted after 30 days. We do not sell your
          data. Contact{" "}
          <a href="mailto:aleksei@alekseimedia.com" className="text-[#f5f5f5] underline">
            aleksei@alekseimedia.com
          </a>{" "}
          with questions.
        </p>
      </div>
    </div>
  );
}
