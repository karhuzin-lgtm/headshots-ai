import { Camera, Check, Lock, Sparkles, Wand2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { WaitlistForm } from "@/components/WaitlistForm";
import { LandingFaq } from "@/components/marketing/landing-faq";
import { LandingHero } from "@/components/marketing/landing-hero";
import { LandingNav } from "@/components/marketing/landing-nav";
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

const comparisonRows = [
  ["Cost", "$200-$500", "Fraction of the cost"],
  ["Time to results", "1-2 weeks", "~15 minutes"],
  ["Scheduling required", "Yes", "No"],
  ["Multiple styles", "Usually 1 look", "6 professional styles"],
  ["Reshoots", "Extra cost", "Included"],
  ["Location", "Must travel to studio", "From anywhere"],
];

const beforeAfterPairs = [
  { before: "/man-before.jpg", after: "/man-after.jpg" },
  { before: "/exec-before.jpg", after: "/exec-after.jpg" },
  { before: "/woman2-before.jpg", after: "/woman2-after.jpg" },
];

const companies = ["Google", "Stripe", "Apple"];

function SectionIntro({
  label,
  title,
  subtitle,
  dark = false,
}: {
  label?: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
}) {
  return (
    <ScrollReveal className="mx-auto max-w-3xl text-center">
      {label && (
        <p
          className={
            dark
              ? "text-xs font-semibold uppercase tracking-[0.22em] text-white/45"
              : "text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500"
          }
        >
          {label}
        </p>
      )}
      <h2
        className={
          dark
            ? "mt-4 text-4xl font-normal tracking-tight text-white sm:text-5xl"
            : "mt-4 text-4xl font-normal tracking-tight text-[#0a0a0a] sm:text-5xl"
        }
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={
            dark
              ? "mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed text-white/55"
              : "mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed text-neutral-500"
          }
        >
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#fafafa] text-[#0a0a0a]">
      <LandingNav />

      <main>
        <LandingHero />

        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionIntro
              label="Results"
              title="Real transformations"
              subtitle="Everyday selfies become studio-quality headshots — same person, professional polish."
            />
            <div className="mt-14 grid gap-6 lg:grid-cols-3">
              {beforeAfterPairs.map((pair, index) => (
                <ScrollReveal key={pair.before} delay={index * 0.06}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80">
                      <Image
                        src={`${pair.before}?v=20260517-3`}
                        alt="Before selfie"
                        width={320}
                        height={400}
                        className="aspect-[4/5] w-full object-cover"
                        priority={index === 0}
                        sizes="(max-width: 1024px) 45vw, 200px"
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                        Before
                      </span>
                    </div>
                    <div className="relative overflow-hidden rounded-2xl border border-neutral-200/80 shadow-lg shadow-black/5">
                      <Image
                        src={`${pair.after}?v=20260517-3`}
                        alt="After AI headshot"
                        width={320}
                        height={400}
                        className="aspect-[4/5] w-full object-cover"
                        priority={index === 0}
                        sizes="(max-width: 1024px) 45vw, 200px"
                      />
                      <span className="absolute left-2 top-2 rounded-full bg-[#0a0a0a] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                        After
                      </span>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-neutral-200/80 bg-white py-14">
          <div className="mx-auto max-w-7xl px-5 text-center sm:px-6 lg:px-8">
            <ScrollReveal>
              <p className="text-sm font-medium text-neutral-500">
                Professionals from
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
                {companies.map((name) => (
                  <span
                    key={name}
                    className="font-display text-2xl font-normal tracking-tight text-neutral-300 sm:text-3xl"
                  >
                    {name}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 bg-[#fafafa] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionIntro label="How it works" title="Three steps to studio-quality portraits" />
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <ScrollReveal
                  key={step.title}
                  delay={index * 0.06}
                  className="rounded-2xl border border-neutral-200/80 bg-white p-8 shadow-sm"
                >
                  <p className="font-display text-6xl font-normal leading-none text-neutral-200">
                    {step.n}
                  </p>
                  <h3 className="mt-6 text-xl font-medium tracking-tight text-[#0a0a0a]">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-neutral-500">{step.body}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <StylesSection />

        <section className="bg-white py-20 sm:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
            <SectionIntro title="AI headshots vs. traditional photography" />
            <ScrollReveal className="mt-12">
              <div className="grid gap-3 md:hidden">
                {comparisonRows.map(([feature, traditional, ai]) => (
                  <div
                    key={feature}
                    className="rounded-2xl border border-neutral-200/80 bg-[#fafafa] p-5"
                  >
                    <h3 className="text-base font-semibold text-[#0a0a0a]">{feature}</h3>
                    <div className="mt-4 grid gap-3 text-sm">
                      <div>
                        <p className="font-medium text-neutral-400">Traditional</p>
                        <p className="mt-1 text-neutral-600">{traditional}</p>
                      </div>
                      <div>
                        <p className="font-medium text-neutral-400">AI headshots</p>
                        <p className="mt-1 inline-flex items-center gap-2 font-medium text-[#0a0a0a]">
                          <Check className="h-4 w-4" />
                          {ai}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden overflow-hidden rounded-2xl border border-neutral-200/80 md:block">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200/80 bg-[#fafafa]">
                      <th className="px-6 py-5 font-semibold text-neutral-500">Feature</th>
                      <th className="px-6 py-5 font-semibold text-neutral-500">
                        Traditional photographer
                      </th>
                      <th className="px-6 py-5 font-semibold text-[#0a0a0a]">AI headshots</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map(([feature, traditional, ai], index) => (
                      <tr
                        key={feature}
                        className={index % 2 === 0 ? "bg-white" : "bg-[#fafafa]/80"}
                      >
                        <td className="px-6 py-5 font-medium text-[#0a0a0a]">{feature}</td>
                        <td className="px-6 py-5 text-neutral-500">{traditional}</td>
                        <td className="px-6 py-5 font-medium text-[#0a0a0a]">
                          <span className="inline-flex items-center gap-2">
                            <Check className="h-4 w-4" />
                            {ai}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section className="bg-[#fafafa] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionIntro title="Built for professionals who care how they look online" />
            <div className="mt-14 grid gap-6 sm:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <ScrollReveal
                    key={feature.title}
                    delay={index * 0.04}
                    className="flex gap-5 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-sm"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f5f0e8] text-[#0a0a0a]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium tracking-tight text-[#0a0a0a]">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-neutral-500">
                        {feature.body}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        <LandingFaq items={faqItems} />

        <section
          id="waitlist"
          className="relative scroll-mt-24 overflow-hidden bg-[#0a0a0a] px-5 py-20 text-center text-white sm:px-6 sm:py-28"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_100%,rgba(201,169,110,0.12),transparent_60%)]" />
          <ScrollReveal className="relative mx-auto max-w-2xl">
            <SectionIntro
              dark
              title="Your professional headshot is one upload away"
              subtitle="Join early access. Founding members get 40% off when generation opens."
            />
            <WaitlistForm variant="hero" showLabel={false} className="mx-auto mt-10 max-w-xl text-left" />
          </ScrollReveal>
        </section>
      </main>

      <footer className="border-t border-neutral-200/80 bg-white px-5 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg font-semibold tracking-tight text-[#0a0a0a]">
            Headshots
          </p>
          <div className="flex flex-wrap gap-6 text-sm text-neutral-500">
            <Link href="/privacy" className="transition hover:text-[#0a0a0a]">
              Privacy
            </Link>
            <Link href="/terms" className="transition hover:text-[#0a0a0a]">
              Terms
            </Link>
            <a
              href="mailto:aleksei@alekseimedia.com"
              className="transition hover:text-[#0a0a0a]"
            >
              Contact
            </a>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-7xl text-xs text-neutral-400">
          © 2026 Aleksei Media. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
