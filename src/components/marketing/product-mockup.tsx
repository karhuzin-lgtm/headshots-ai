import Image from "next/image";
import { Check, Download } from "lucide-react";

import { DISPLAY_STYLES } from "@/lib/display-styles";

const steps = [
  { label: "Upload selfies", done: true },
  { label: "Train your model", done: true },
  { label: "Generate headshots", done: true },
];

export function ProductMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-[#c9a96e]/20 via-transparent to-[#111827]/5 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-[#0f1219] shadow-[0_32px_80px_-24px_rgba(0,0,0,0.45)] ring-1 ring-black/5">
        {/* Browser chrome */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-[#161b26] px-4 py-3">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex min-w-0 flex-1 items-center justify-center rounded-lg bg-[#0c0e12] px-3 py-1.5">
            <span className="truncate text-[11px] text-gray-500">headshots.alekseimedia.com/results</span>
          </div>
        </div>

        <div className="flex min-h-[340px] sm:min-h-[380px]">
          {/* Sidebar */}
          <aside className="hidden w-[140px] shrink-0 border-r border-white/10 bg-[#12161f] p-4 sm:block">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Your session</p>
            <ul className="mt-4 space-y-3">
              {steps.map((step) => (
                <li key={step.label} className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  <span className="text-[11px] leading-tight text-gray-400">{step.label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-lg border border-[#c9a96e]/30 bg-[#c9a96e]/10 px-2.5 py-2">
              <p className="text-[10px] font-medium text-[#e8d4b0]">~20 min total</p>
            </div>
          </aside>

          {/* Main */}
          <div className="min-w-0 flex-1 p-4 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">Ready</p>
                <h3 className="mt-1 text-sm font-medium text-white sm:text-base">Your headshots are ready</h3>
                <p className="mt-0.5 text-[11px] text-gray-500">6 styles · high resolution</p>
              </div>
              <button
                type="button"
                className="flex shrink-0 items-center gap-1.5 rounded-lg bg-white px-2.5 py-1.5 text-[11px] font-semibold text-gray-900"
                tabIndex={-1}
                aria-hidden
              >
                <Download className="h-3 w-3" />
                Download
              </button>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              {DISPLAY_STYLES.map((style) => (
                <div
                  key={style.key}
                  className="group relative overflow-hidden rounded-lg ring-1 ring-white/10"
                >
                  <Image
                    src={style.photo}
                    alt={style.name}
                    width={160}
                    height={213}
                    className="aspect-[3/4] w-full object-cover object-top"
                    sizes="120px"
                    priority
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 pb-1.5 pt-6">
                    <span className="text-[9px] font-semibold text-white sm:text-[10px]">{style.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
