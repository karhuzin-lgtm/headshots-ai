import { Download, Sparkles, Upload } from "lucide-react";
import Image from "next/image";

import { SectionIntro } from "@/components/marketing/section-intro";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { DISPLAY_STYLES } from "@/lib/display-styles";
import { MY_BEFORE_PHOTO } from "@/lib/my-photos";

const steps = [
  {
    icon: Upload,
    title: "Upload your selfies",
    body: "8–20 casual photos from your phone. Different angles, good light, no heavy filters.",
    visual: "upload" as const,
  },
  {
    icon: Sparkles,
    title: "AI trains on you",
    body: "A private model learns your face — not a generic filter. This takes about 20 minutes. We email when it's ready.",
    visual: "train" as const,
  },
  {
    icon: Download,
    title: "Download your headshots",
    body: "Receive 18 professional headshots across all 6 styles. Ready to use on LinkedIn, your website, or email signature. High resolution, no watermarks.",
    visual: "download" as const,
  },
];

function StepVisual({ type }: { type: "upload" | "train" | "download" }) {
  if (type === "upload") {
    return (
      <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-gray-200 bg-[#faf8f5] p-4">
        <div className="relative h-24 w-20 overflow-hidden rounded-lg shadow-md ring-2 ring-white">
          <Image src={MY_BEFORE_PHOTO} alt="" width={80} height={107} className="h-full w-full object-cover" />
        </div>
        <span className="ml-3 text-xs text-gray-400">+ 11 more</span>
      </div>
    );
  }
  if (type === "train") {
    return (
      <div className="flex aspect-[4/3] flex-col justify-center rounded-xl border border-gray-100 bg-[#faf8f5] p-5">
        <p className="text-xs font-medium text-gray-500">Training your model</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
          <div className="h-full w-[72%] rounded-full bg-[#c9a96e]" />
        </div>
        <p className="mt-2 text-[11px] text-gray-400">~20 min total</p>
      </div>
    );
  }
  return (
    <div className="grid aspect-[4/3] grid-cols-3 gap-1.5 rounded-xl border border-gray-100 bg-white p-2">
      {DISPLAY_STYLES.map((style) => (
        <div key={style.key} className="relative overflow-hidden rounded-md">
          <Image
            src={style.photo}
            alt=""
            width={80}
            height={107}
            className="aspect-[3/4] h-full w-full object-cover object-top"
          />
        </div>
      ))}
    </div>
  );
}

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionIntro
          label="How it works"
          title="Three steps. Twenty minutes."
          subtitle="From phone selfies to LinkedIn-ready portraits — without leaving home."
        />
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <ScrollReveal key={step.title} delay={index * 0.06}>
                <div className="flex h-full flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f5f0e8] text-[#111827]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-6 font-display text-5xl font-normal leading-none text-gray-200">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-xl font-normal tracking-tight text-[#111827]">{step.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-500">{step.body}</p>
                  <div className="mt-6">
                    <StepVisual type={step.visual} />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
