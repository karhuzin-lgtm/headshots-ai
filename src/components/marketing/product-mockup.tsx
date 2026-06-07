import Image from "next/image";
import { Sparkles } from "lucide-react";

import { DISPLAY_STYLES } from "@/lib/display-styles";
import { MY_BEFORE_PHOTO } from "@/lib/my-photos";

/**
 * Hero visual: a clean branded "selfie → result" card. No fake browser chrome —
 * shows the actual before photo transforming into real generated results.
 */
export function ProductMockup() {
  const afters = DISPLAY_STYLES.slice(0, 4);

  return (
    <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
      <div className="absolute -inset-6 rounded-[2.5rem] bg-[radial-gradient(circle_at_30%_15%,rgba(201,169,110,0.20),transparent_70%)] blur-2xl" />

      <div className="relative rounded-3xl border border-gray-200/80 bg-white p-5 shadow-[0_32px_80px_-32px_rgba(0,0,0,0.35)] sm:p-6">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9a7b4f]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden /> AI-генерация
          </span>
          <span className="rounded-full bg-[#faf8f5] px-2.5 py-1 text-[10px] font-medium text-gray-500">
            готово за ~20 минут
          </span>
        </div>

        <div className="mt-4 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1.45fr)] items-center gap-3 sm:gap-4">
          <figure className="min-w-0">
            <div className="overflow-hidden rounded-2xl ring-1 ring-gray-200/80">
              <Image
                src={MY_BEFORE_PHOTO}
                alt="Ваше обычное селфи"
                width={300}
                height={400}
                className="aspect-[3/4] w-full object-cover object-top"
                sizes="(max-width: 640px) 35vw, 200px"
                priority
              />
            </div>
            <figcaption className="mt-2 text-center text-[11px] font-medium uppercase tracking-wider text-gray-400">
              Ваше селфи
            </figcaption>
          </figure>

          <div className="flex items-center justify-center text-2xl leading-none text-[#c9a96e]" aria-hidden>
            →
          </div>

          <figure className="min-w-0">
            <div className="grid grid-cols-2 gap-2">
              {afters.map((style) => (
                <div key={style.key} className="overflow-hidden rounded-xl ring-1 ring-gray-200/80">
                  <Image
                    src={style.photo}
                    alt={`AI-портрет — ${style.name}`}
                    width={180}
                    height={240}
                    className="aspect-[3/4] w-full object-cover object-top"
                    sizes="(max-width: 640px) 22vw, 120px"
                  />
                </div>
              ))}
            </div>
            <figcaption className="mt-2 text-center text-[11px] font-medium uppercase tracking-wider text-[#9a7b4f]">
              Результат · 6 стилей
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
