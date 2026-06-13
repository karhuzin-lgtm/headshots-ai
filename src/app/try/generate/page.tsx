import { Suspense } from "react";

import { LandingFooter } from "@/components/marketing/landing-footer";
import { TryFlowHeader } from "@/components/try/try-flow-header";
import { purchasableTiers } from "@/lib/tiers";
import { TryFreeClient } from "../try-free-client";

export default function TryGeneratePage() {
  const tiers = purchasableTiers();
  return (
    <div className="flex min-h-dvh flex-col bg-[#0a0a09] text-white">
      <TryFlowHeader step="01 / Выбор, данные и оплата" />
      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px]">
          <div className="absolute inset-0 bg-[url('/generated/hero-atmosphere.jpg')] bg-cover bg-center opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#071018]/40 via-[#0a0a09]/85 to-[#0a0a09]" />
          <div className="site-grain absolute inset-0 opacity-20" />
        </div>

        <div className="relative mx-auto max-w-[1500px] px-5 pb-10 pt-14 sm:px-7 sm:pt-20">
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-white/40">Персональная фотосессия</p>
          <h1 className="mt-5 max-w-[1320px] font-display text-[clamp(3.4rem,7.5vw,7rem)] font-semibold leading-[0.86] tracking-[-0.08em]">
            Выберите свой набор.
            <br />
            <span className="text-white/28">Затем загрузите фото.</span>
          </h1>
          <p className="mt-7 max-w-xl text-base font-light leading-7 text-white/50">
            Сначала сравните три варианта и входящие стили. Затем укажите почту, загрузите 8–20 селфи и перейдите к оплате.
          </p>
        </div>

        <Suspense
          fallback={
            <div className="relative py-24 text-center font-mono text-[9px] uppercase tracking-[0.22em] text-white/40">
              Загружаем интерфейс…
            </div>
          }
        >
          <TryFreeClient tiers={tiers} />
        </Suspense>
      </main>
      <LandingFooter />
    </div>
  );
}
