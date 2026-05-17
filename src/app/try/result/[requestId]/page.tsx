import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { TryResultClient } from "./result-client";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { requestId: string };
};

export default function TryResultPage({ params }: PageProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />
      <main className="relative flex-1">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[min(52vh,520px)] bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent blur-[100px]"
          aria-hidden
        />
        <div className="relative">
          <TryResultClient requestId={params.requestId} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
