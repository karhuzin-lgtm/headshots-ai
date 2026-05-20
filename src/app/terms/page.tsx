import Link from "next/link";

export const metadata = {
  title: "Terms of Service — Headshots",
};

export default function TermsPage() {
  return (
    <div className="min-h-dvh bg-[#080808] px-5 py-16 text-[#f5f5f5] sm:px-6">
      <div className="mx-auto max-w-2xl">
        <Link href="/" className="text-sm text-[#888] hover:text-[#f5f5f5]">
          ← Back
        </Link>
        <h1 className="mt-8 text-4xl font-normal tracking-tight">Terms of Service</h1>
        <p className="mt-6 text-sm leading-relaxed text-[#888]">
          By using Headshots you agree to use the service lawfully. You retain ownership of
          generated images. The service is provided as-is during early access. Contact{" "}
          <a href="mailto:aleksei@alekseimedia.com" className="text-[#f5f5f5] underline">
            aleksei@alekseimedia.com
          </a>{" "}
          for support.
        </p>
      </div>
    </div>
  );
}
