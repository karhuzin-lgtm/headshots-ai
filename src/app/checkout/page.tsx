import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { GET_STARTED_URL, PRIMARY_CTA } from "@/lib/landing-config";

export default function CheckoutPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <SiteHeader />
      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:py-20 md:px-6">
        <div className="glass-panel-strong relative rounded-3xl px-8 py-14 sm:px-12 sm:py-16">
          <h1 className="font-display text-3xl font-normal tracking-[-0.02em] text-gradient-display sm:text-4xl">
            Let&apos;s create your headshots
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed tracking-tight text-muted-foreground sm:text-base">
            Card payment is being finalized. In the meantime you can start now — upload your selfies and
            we&apos;ll email your professional headshots in about 20 minutes.
          </p>
          <Button
            asChild
            className="mt-10 h-12 w-full max-w-xs rounded-full bg-[#111827] text-white hover:bg-black"
          >
            <Link href={GET_STARTED_URL}>{PRIMARY_CTA.label}</Link>
          </Button>
          <Button
            asChild
            variant="ghost"
            className="mt-3 h-10 w-full max-w-xs text-muted-foreground"
          >
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
