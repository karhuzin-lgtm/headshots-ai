import { SiteHeader } from "@/components/marketing/site-header";
import { TryResultClient } from "./result-client";

export const dynamic = "force-dynamic";

type PageProps = {
  params: { requestId: string };
};

export default function TryResultPage({ params }: PageProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <SiteHeader variant="minimal" />
      <main className="relative flex-1">
        <div className="relative">
          <TryResultClient requestId={params.requestId} />
        </div>
      </main>
      <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        © 2026 Aleksei Media · headshots.alekseimedia.com
      </footer>
    </div>
  );
}
