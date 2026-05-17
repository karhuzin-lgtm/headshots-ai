import { Suspense } from "react";

import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { JobResultsClient } from "./job-results-client";

type PageProps = { params: { jobId: string } };

export default function ResultsPage({ params }: PageProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <SiteHeader />
      <main className="relative flex-1">
        <Suspense
          fallback={
            <div className="py-32 text-center text-sm text-muted-foreground">Loading…</div>
          }
        >
          <JobResultsClient jobId={params.jobId} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
