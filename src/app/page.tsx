import { Camera, Lock, Sparkles, Wand2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { WaitlistForm } from "@/components/WaitlistForm";
import {
  FeatureComparisonTable,
  type ComparisonFeature,
} from "@/components/marketing/feature-comparison-table";
import { LandingHero } from "@/components/marketing/landing-hero";
import { LandingNav } from "@/components/marketing/landing-nav";
import { PremiumFaq } from "@/components/marketing/premium-faq";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { StylesSection } from "@/components/marketing/styles-section";

const steps = [
  {
    n: "1",
    title: "Upload your selfies",
    body: "Gather 8 to 20 casual photos from your phone. Good lighting, facing the camera, no heavy filters.",
  },
  {
    n: "2",
    title: "AI trains on your face",
    body: "We build a private AI model trained specifically on you. About 15 minutes. Your data stays secure.",
  },
  {
    n: "3",
    title: "Download your headshots",
    body: "Professional portraits in your chosen style. High resolution, no watermarks — ready for LinkedIn and press.",
  },
];

const faqItems = [
  {
    q: "How many photos do I need to upload?",
    a: "We recommend 8 to 20 photos for the best results. Casual selfies work perfectly — just make sure your face is clearly visible and well-lit.",
  },
  {
    q: "What file formats and sizes are supported?",
    a: "We accept JPG, PNG, WebP, and HEIC files. Each photo can be up to 10MB. Smartphone photos are perfect.",
  },
  {
    q: "How long does the process take?",
    a: "From upload to results is approximately 15 minutes. We will email you as soon as your headshots are ready.",
  },
  {
    q: "Are my photos stored permanently?",
    a: "No. Your uploaded photos and the AI model trained on your face are automatically deleted after 30 days.",
  },
  {
    q: "Can I use these photos commercially?",
    a: "Yes. You own the generated headshots and can use them for LinkedIn, your website, business cards, or press.",
  },
  {
    q: "What if I don't like the results?",
    a: "If you don't find at least 5 photos you'd use on LinkedIn — we retrain your model for free or refund every cent.",
  },
];

const features = [
  {
    icon: Camera,
    title: "Looks like you — not like AI",
    body: "We train a private model on your face specifically. Colleagues won't know it's AI.",
  },
  {
    icon: Sparkles,
    title: "Trained on your face specifically",
    body: "Unlike generic AI filters, we train a personal model on your photos — not an average of thousands of faces.",
  },
  {
    icon: Wand2,
    title: "Multiple looks from one session",
    body: "Choose from 6 professional styles. Multiple variations per style for LinkedIn, website, and press.",
  },
  {
    icon: Lock,
    title: "Private by design",
    body: "Your photos are never shared, never used to train other models, and deleted automatically after 30 days.",
  },
];

const comparisonFeatures: ComparisonFeature[] = [
  { name: "Cost", traditional: "$200–$500", ai: "Fraction of the cost" },
  { name: "Time to results", traditional: "1–2 weeks", ai: "~15 minutes" },
  { name: "Scheduling required", traditional: "Yes", ai: "No" },
  { name: "Multiple styles", traditional: "Usually 1 look", ai: "6 professional styles" },
  { name: "Reshoots", traditional: "Extra cost", ai: "Included" },
  { name: "Location", traditional: "Must travel to studio", ai: "From anywhere" },
];

const beforeAfterPairs = [
  { before: "/man-before.jpg", after: "/man-after.jpg" },
  { before: "/exec-before.jpg", after: "/exec-after.jpg" },
  { before: "/woman2-before.jpg", after: "/woman2-after.jpg" },
];

function SectionIntro({
  label,
  title,
  subtitle,
}: {
  label?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <ScrollReveal className="mx-auto max-w-3xl text-center">
      {label && (
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#888]">{label}</p>
      )}
      <h2 className="mt-4 text-4xl font-normal tracking-tight text-[#f5f5f5] sm:text-5xl">{title}</h2>
      {subtitle && (
        <p className="mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed text-[#888]">
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}

function PillLabel({ children }: { children: string }) {
  return (
    <span className="absolute left-3 top-3 rounded-full border border-white/[0.08] bg-black/60 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-[#f5f5f5] backdrop-blur-sm">
      {children}
    </span>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#080808] text-[#f5f5f5]">
      <LandingNav />

      <main>
        <LandingHero />

        <section className="bg-[#080808] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionIntro
              label="Results"
              title="Real transformations"
              subtitle="Everyday selfies become studio-quality headshots — same person, professional polish."
            />
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {beforeAfterPairs.map((pair, index) => (
                <ScrollReveal key={pair.before} delay={index * 0.06}>
                  <div className="glass-card rounded-2xl p-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative overflow-hidden rounded-xl border border-white/[0.08]">
                        <Image
                          src={`${pair.before}?v=20260517-3`}
                          alt="Before selfie"
                          width={320}
                          height={400}
                          className="aspect-[4/5] w-full object-cover"
                          priority={index === 0}
                          sizes="(max-width: 1024px) 45vw, 200px"
                        />
                        <PillLabel>Before</PillLabel>
                      </div>
                      <div className="relative overflow-hidden rounded-xl border border-white/[0.08]">
                        <Image
                          src={`${pair.after}?v=20260517-3`}
                          alt="After AI headshot"
                          width={320}
                          height={400}
                          className="aspect-[4/5] w-full object-cover"
                          priority={index === 0}
                          sizes="(max-width: 1024px) 45vw, 200px"
                        />
                        <PillLabel>After — AI</PillLabel>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-white/[0.06] bg-[#080808] py-14">
          <div className="mx-auto max-w-7xl px-5 text-center sm:px-6 lg:px-8">
            <ScrollReveal>
              <p className="text-sm font-medium text-[#888]">
                Professionals from{" "}
                <span className="text-[#f5f5f5]">Google, Stripe, Apple</span> on the waitlist
              </p>
            </ScrollReveal>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 bg-[#080808] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionIntro label="How it works" title="Three steps to studio-quality portraits" />
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <ScrollReveal key={step.title} delay={index * 0.06} className="glass-card rounded-2xl p-8">
                  <p className="font-display text-7xl font-normal leading-none text-[#f5f5f5] opacity-20">
                    {step.n}
                  </p>
                  <h3 className="mt-6 text-xl font-medium tracking-tight text-[#f5f5f5]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#888]">{step.body}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <StylesSection />

        <section className="bg-[#080808] py-20 sm:py-28">
          <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
            <ScrollReveal>
              <FeatureComparisonTable features={comparisonFeatures} />
            </ScrollReveal>
          </div>
        </section>

        <section className="bg-[#080808] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionIntro title="Built for professionals who care how they look online" />
            <div className="mt-14 grid gap-5 sm:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <ScrollReveal
                    key={feature.title}
                    delay={index * 0.04}
                    className="glass-card glass-card-hover flex gap-5 rounded-2xl p-6"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-[#f5f5f5]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium tracking-tight text-[#f5f5f5]">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-[#888]">{feature.body}</p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        <PremiumFaq items={faqItems} />

        <section
          id="waitlist"
          className="relative scroll-mt-24 overflow-hidden bg-[#050505] px-5 py-20 text-center sm:px-6 sm:py-28"
        >
          <div className="pointer-events-none absolute inset-0 glow-amber-center" />
          <ScrollReveal className="relative mx-auto max-w-2xl">
            <h2 className="font-display text-4xl font-normal tracking-tight text-[#f5f5f5] sm:text-5xl">
              Your professional headshot is one upload away
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-base font-light leading-relaxed text-[#888]">
              Join early access. Founding members get 40% off at launch.
            </p>
            <WaitlistForm variant="hero" showLabel={false} className="mx-auto mt-10 max-w-lg text-left" />
          </ScrollReveal>
        </section>
      </main>

      <footer className="border-t border-white/[0.06] bg-[#080808] px-5 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg font-semibold tracking-tight text-[#f5f5f5]">
            Headshots
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-[#888]">
            <Link href="/privacy" className="transition hover:text-[#f5f5f5]">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-[#f5f5f5]">
              Terms
            </Link>
            <a href="mailto:aleksei@alekseimedia.com" className="transition hover:text-[#f5f5f5]">
              Contact
            </a>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-7xl text-xs text-[#888]">
          © 2026 Aleksei Media. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
