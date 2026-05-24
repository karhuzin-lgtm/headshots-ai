import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { PRIMARY_CTA } from "@/lib/landing-config";

export default function CheckoutPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <SiteHeader />
      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:py-20 md:px-6">
        <div className="glass-panel-strong relative rounded-3xl px-8 py-14 sm:px-12 sm:py-16">
          <h1 className="font-display text-3xl font-normal tracking-[-0.02em] text-gradient-display sm:text-4xl">
            Checkout opens with early access
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed tracking-tight text-muted-foreground sm:text-base">
            Paid checkout isn&apos;t connected yet. Join the waitlist to lock in the €29 founding price — we&apos;ll
            email you when billing goes live.
          </p>
          <Button
            asChild
            className="mt-10 h-12 w-full max-w-xs rounded-full bg-[#111827] text-white hover:bg-black"
          >
            <Link href={PRIMARY_CTA.href}>{PRIMARY_CTA.label}</Link>
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
