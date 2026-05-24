import { LandingFooter } from "@/components/marketing/landing-footer";
import { TryFlowHeader } from "@/components/try/try-flow-header";
import { TryResultClient } from "./result-client";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { requestId: string };
};

export default function TryResultPage({ params }: PageProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#faf8f5] text-[#111827]">
      <TryFlowHeader />
      <main className="relative flex-1">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgba(201,169,110,0.12),transparent_70%)]" />
        </div>
        <div className="relative">
          <TryResultClient requestId={params.requestId} />
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
