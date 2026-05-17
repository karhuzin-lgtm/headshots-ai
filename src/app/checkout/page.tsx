import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

export default function CheckoutPage() {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <SiteHeader />
      <main className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:py-20 md:px-6">
        <div className="glass-panel-strong relative rounded-3xl px-8 py-14 sm:px-12 sm:py-16">
          <h1 className="font-display text-3xl font-normal tracking-[-0.02em] text-gradient-display sm:text-4xl">
            Checkout
          </h1>
          <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed tracking-tight text-muted-foreground sm:text-base">
            Your secure payment step will appear here when billing is connected.
          </p>
          <Button
            asChild
            variant="outline"
            className="mt-10 h-12 w-full max-w-xs rounded-full border-gray-200 bg-white text-foreground hover:bg-gray-50"
          >
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
