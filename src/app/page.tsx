import Image from "next/image";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WaitlistForm } from "@/components/WaitlistForm";
import { LandingHero } from "@/components/marketing/landing-hero";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";

const steps = [
  {
    n: "01",
    title: "Upload your selfies",
    body: "Eight to twenty recent phone photos are enough. Natural light, clean angles, no studio visit.",
  },
  {
    n: "02",
    title: "Choose one direction",
    body: "Corporate, Executive, Tech, Creative, Startup, or LinkedIn. Each style is tuned for believable wardrobe and lighting.",
  },
  {
    n: "03",
    title: "Receive your headshots",
    body: "Your headshots arrive in about 10-15 minutes. Download them, share them, use them anywhere.",
  },
];

const styleCards = [
  {
    label: "LinkedIn",
    description: "Clean shirt, neutral gray, soft studio light.",
    src: "/woman2-after.jpg",
  },
  {
    label: "Corporate",
    description: "Tailored suit energy without the studio day.",
    src: "/man-after.jpg?v=20260517-2",
  },
  {
    label: "Executive",
    description: "Dark backdrop, confident expression, premium polish.",
    src: "/exec-after.jpg",
  },
  {
    label: "Tech",
    description: "Modern office feel, approachable and sharp.",
    src: "/man-after.jpg?v=20260517-2",
  },
  {
    label: "Creative",
    description: "Warm background, relaxed direction, editorial finish.",
    src: "/woman2-after.jpg",
  },
  {
    label: "Startup",
    description: "Simple, bright, founder-friendly profile image.",
    src: "/exec-after.jpg",
  },
];

const faqItems = [
  {
    q: "Do I need professional photos to upload?",
    a: "No. Phone selfies work great — natural light, a few angles, and no heavy filters are all you need.",
  },
  {
    q: "How long does it take?",
    a: "We are in private beta. Join the waitlist and we will email you as soon as your early access invite is ready.",
  },
  {
    q: "What if I don't like the results?",
    a: "During private beta, we are using feedback to improve the product before public launch.",
  },
  {
    q: "What photos should I upload?",
    a: "Use 8-20 clear selfies of your face with varied lighting and angles. Avoid heavy filters, sunglasses, or group shots. The better the input, the better the output.",
  },
  {
    q: "What happens when I join the waitlist?",
    a: "We will save your email and send you launch updates, early access, and 20% off when Headshots opens publicly.",
  },
  {
    q: "Is my data safe?",
    a: "Uploads and job metadata are stored securely. We use Supabase for persistence and industry-standard practices. You can request deletion of your job data by contacting support.",
  },
];

function StyleShowcase() {
  return (
    <div className="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4 [scrollbar-width:none] md:mx-0 md:px-0">
      {styleCards.map((style, index) => (
        <div
          key={style.label}
          className="group relative h-[380px] w-[280px] shrink-0 snap-start overflow-hidden rounded-3xl border border-white/10 bg-[color:var(--bg-2)] transition duration-300 hover:scale-[1.03] hover:ring-2 hover:ring-[color:var(--accent)]"
        >
          <Image
            src={style.src}
            alt={`${style.label} AI headshot style`}
            width={560}
            height={760}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            sizes="280px"
            priority={index < 2}
          />
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-5">
            <p className="font-display text-3xl text-white">{style.label}</p>
            <p className="mt-2 translate-y-2 text-sm font-light leading-relaxed text-white/70 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {style.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-[color:var(--bg)]">
      <SiteHeader />

      <main className="flex-1">
        <LandingHero />

        <section id="styles" className="border-b border-[color:var(--border)] bg-[color:var(--bg)] py-20 sm:py-24">
          <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-10">
            <ScrollReveal className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">Style showcase</p>
              <h2 className="font-display mt-5 text-4xl font-normal leading-none tracking-[-0.03em] text-white sm:text-5xl">
                Choose your style
              </h2>
              <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-muted-foreground">
                Scroll through editorial directions built for LinkedIn, founders, executives, and creative profiles.
              </p>
            </ScrollReveal>
            <ScrollReveal className="mt-12">
              <StyleShowcase />
            </ScrollReveal>
          </div>
        </section>

        <section id="process" className="scroll-mt-20 border-b border-[color:var(--border)] bg-[color:var(--bg-2)] py-20 sm:py-24">
          <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-10">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-primary">How it works</p>
              <h2 className="font-display mt-5 text-4xl font-normal leading-none tracking-[-0.03em] text-white sm:text-5xl">
                Three steps, no studio.
              </h2>
            </ScrollReveal>

            <div className="relative mt-16 grid gap-8 md:grid-cols-3 md:gap-10">
              <div className="absolute left-0 right-0 top-10 hidden h-px bg-[color:var(--border)] md:block" />
              {steps.map((step, i) => (
                <ScrollReveal key={step.n} delay={i * 0.08} className="relative">
                  <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full border border-[color:var(--border)] bg-[color:var(--bg)]">
                    <span className="font-display text-4xl text-primary">{step.n}</span>
                  </div>
                  <h3 className="text-lg font-medium tracking-[-0.02em] text-white">{step.title}</h3>
                  <p className="mt-3 max-w-sm text-sm font-light leading-relaxed tracking-tight text-muted-foreground">
                    {step.body}
                  </p>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal className="mt-16 rounded-[2rem] border border-[color:var(--border)] bg-[color:var(--bg-3)] p-8 md:p-10">
              <div className="grid gap-8 text-center md:grid-cols-3">
                {[
                  ["10 min", "average first results"],
                  ["6 styles", "editorial directions"],
                  ["Free trial", "for early users"],
                ].map(([value, label]) => (
                  <div key={value}>
                    <p className="font-display text-5xl text-white">{value}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </section>

        <section
          id="waitlist"
          className="scroll-mt-20 mx-auto max-w-2xl px-6 py-24 text-center"
        >
          <ScrollReveal>
            <h2 className="font-display text-3xl font-normal tracking-[-0.02em] text-gradient-display sm:text-4xl">
              First 100 testers get it free
            </h2>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed tracking-tight text-muted-foreground">
              After launch: $29–$69 one-time. Right now: 1 free headshot, no card needed. Join the
              waitlist → upload 8+ photos → get your headshots in ~15 minutes.
            </p>
              <WaitlistForm variant="dark" className="mx-auto mt-8 max-w-lg" />
          </ScrollReveal>
        </section>

        <section id="faq" className="scroll-mt-20 border-y border-[color:var(--border)] bg-[color:var(--bg-2)] py-20 sm:py-24">
          <div className="mx-auto max-w-2xl px-4 md:px-6 lg:px-10">
            <ScrollReveal className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">FAQ</p>
              <h2 className="font-display mt-5 text-3xl font-normal tracking-[-0.02em] text-gradient-display sm:text-4xl">
                Questions, answered.
              </h2>
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed tracking-tight text-muted-foreground">
                Straight facts — no marketing fog.
              </p>
            </ScrollReveal>
            <ScrollReveal className="mt-12" delay={0.06}>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, i) => (
                  <AccordionItem key={item.q} value={`item-${i}`}>
                    <AccordionTrigger>{item.q}</AccordionTrigger>
                    <AccordionContent>{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollReveal>
          </div>
        </section>

        <section className="bg-[color:var(--accent)] py-16 sm:py-20 md:py-24">
          <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-10">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-4xl font-normal leading-[1.05] tracking-[-0.03em] text-black sm:text-5xl">
                Your professional headshot awaits.
              </h2>
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed tracking-tight text-black/60">
                Only 87 spots left. No credit card. No catch.
              </p>
              <WaitlistForm className="mx-auto mt-11 max-w-lg" />
            </ScrollReveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
