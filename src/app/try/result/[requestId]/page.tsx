import { LandingFooter } from "@/components/marketing/landing-footer";
import { TryFlowHeader } from "@/components/try/try-flow-header";
import { TryResultClient } from "./result-client";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { requestId: string };
};

export default function TryResultPage({ params }: PageProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-[#11110f] text-white">
      <TryFlowHeader step="02 / Оплата и результат" />
      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-25">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/generated/hero-atmosphere.jpg"
            alt=""
            className="h-full w-full object-cover object-center grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#11110f]/30 via-[#11110f]/80 to-[#11110f]" />
        </div>
        <TryResultClient requestId={params.requestId} />
      </main>
      <LandingFooter />
    </div>
  );
}
