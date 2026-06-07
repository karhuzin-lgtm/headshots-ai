import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { PENDING_GENERATION_COOKIE } from "@/lib/lavatop";

export const dynamic = "force-dynamic";

/**
 * LavaTop redirects here after a completed payment (configure this as the
 * product's success/redirect URL in the Lava.top dashboard:
 *   {NEXT_PUBLIC_APP_URL}/try/payment-return ).
 *
 * The actual generation is triggered server-to-server by the LavaTop webhook,
 * so this page only needs to forward the buyer to their result page, which then
 * polls for progress.
 */
export default function PaymentReturnPage() {
  const generationId = cookies().get(PENDING_GENERATION_COOKIE)?.value;

  if (generationId) {
    redirect(`/try/result/${generationId}`);
  }

  redirect("/try");
}
