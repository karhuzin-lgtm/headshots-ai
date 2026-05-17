import Link from "next/link";

import { Button } from "@/components/ui/button";
import { UploadAuthStrip } from "@/components/upload/upload-auth-strip";
import { UploadFlow } from "@/components/upload/upload-flow";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default function UploadPage({ searchParams }: PageProps) {
  const planParam = searchParams.plan;
  const initialPlan =
    typeof planParam === "string" &&
    (planParam === "basic" || planParam === "pro" || planParam === "executive")
      ? planParam
      : null;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="relative flex-1">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[min(52vh,520px)] bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent blur-[100px]"
          aria-hidden
        />
        <div className="relative px-4 pb-8 pt-4 md:px-6 lg:px-10">
          <Button
            asChild
            variant="ghost"
            className="mb-6 h-11 w-full rounded-full text-muted-foreground hover:bg-white/[0.06] hover:text-foreground sm:mb-0 sm:h-10 sm:w-auto md:absolute md:left-6 md:top-4 md:mb-0 lg:left-10"
          >
            <Link href="/">← Back</Link>
          </Button>
          <div className="md:pt-12 lg:pt-14">
            <UploadAuthStrip />
            <UploadFlow initialPlan={initialPlan} />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
