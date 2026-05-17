import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { TryResultClient } from "./result-client";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { requestId: string };
};

export default function TryResultPage({ params }: PageProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-[color:var(--bg)]">
      <SiteHeader />
      <main className="relative flex-1">
        <div className="relative">
          <TryResultClient requestId={params.requestId} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
