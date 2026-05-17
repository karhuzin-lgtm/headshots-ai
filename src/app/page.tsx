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
    title: "Upload 3-20 selfies",
    body: "Phone selfies are fine. We learn lighting, angles, and bone structure — no studio visit.",
  },
  {
    n: "02",
    title: "Pick your favorite styles",
    body: "LinkedIn, Corporate, Casual, Professional, and Creative — each tuned for believable skin, wardrobe, and lighting.",
  },
  {
    n: "03",
    title: "Receive your headshots",
    body: "Your AI-generated headshots arrive in ~5 minutes. Download, share on LinkedIn, use anywhere.",
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
    a: "Use 3-20 clear selfies of your face with varied lighting and angles. Avoid heavy filters, sunglasses, or group shots. The better the input, the better the output.",
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

function BeforeAfterCard() {
  const pairs = [
    { before: "/man-before.jpg", after: "/man-after.jpg", label: "Man" },
    { before: "/exec-before.jpg", after: "/exec-after.jpg", label: "Executive" },
    { before: "/woman2-before.jpg", after: "/woman2-after.jpg", label: "Woman" },
  ];

  return (
    <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
      {pairs.map((pair, i) => (
        <div key={pair.before} className="grid gap-4">
          <div className="relative overflow-hidden rounded-2xl bg-card">
            <Image
              src={pair.before}
              alt={`${pair.label} before reference photo`}
              width={900}
              height={1200}
              className="aspect-[3/4] max-h-[320px] w-full rounded-2xl object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={i === 0}
            />
            <div className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              Before
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl bg-card">
            <Image
              src={pair.after}
              alt={`${pair.label} after AI generated headshot`}
              width={900}
              height={1200}
              className="aspect-[3/4] max-h-[320px] w-full rounded-2xl object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
              priority={i === 0}
            />
            <div className="absolute left-3 top-3 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
              After — AI
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <SiteHeader />

      <main className="flex-1">
        <LandingHero />

        <section className="border-b border-white/[0.06] py-16 sm:py-20 md:py-20">
          <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-10">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                Process
              </p>
              <h2 className="font-display mt-5 text-3xl font-normal leading-[1.12] tracking-[-0.02em] text-gradient-display sm:text-4xl lg:text-[2.65rem]">
                Three steps.
                <br />
                <span className="text-muted-foreground">Zero friction.</span>
              </h2>
            </ScrollReveal>

            <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.06] md:mt-20 md:grid-cols-3 md:rounded-3xl">
              {steps.map((step, i) => (
                <ScrollReveal
                  key={step.n}
                  delay={i * 0.08}
                  className="glass-panel border-0 bg-background/80 p-7 sm:p-9 md:p-11"
                >
                  <span className="font-display text-5xl font-normal tabular-nums tracking-tight text-primary/25">
                    {step.n}
                  </span>
                  <h3 className="mt-7 text-lg font-semibold tracking-[-0.02em] text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed tracking-tight text-muted-foreground">
                    {step.body}
                  </p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="examples" className="scroll-mt-20 py-16 sm:py-20 md:py-20">
          <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-10">
            <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
              <ScrollReveal className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Transformations
                </p>
                <h2 className="font-display mt-5 text-3xl font-normal leading-[1.12] tracking-[-0.02em] text-gradient-display sm:text-4xl lg:text-[2.65rem]">
                  See what&apos;s possible.
                </h2>
                <p className="mt-6 text-base leading-relaxed tracking-tight text-muted-foreground">
                  Example transformations — your results are built from your own photos.
                </p>
              </ScrollReveal>
            </div>

            <ScrollReveal className="mt-12 sm:mt-16" delay={0.08}>
              <BeforeAfterCard />
            </ScrollReveal>
          </div>
        </section>

        <section
          id="waitlist"
          className="scroll-mt-20 px-6 max-w-2xl mx-auto mb-28 text-center"
        >
          <ScrollReveal>
            <h2 className="font-display text-3xl font-normal tracking-[-0.02em] text-gradient-display sm:text-4xl">
              First 100 testers get it free
            </h2>
            <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed tracking-tight text-muted-foreground">
              After launch: $29–$69 one-time. Right now: 1 free headshot, no card needed. Join the
              waitlist → upload 3+ photos → get your headshots in ~5 minutes.
            </p>
            <WaitlistForm className="mx-auto mt-8 max-w-lg" />
          </ScrollReveal>
        </section>

        <section id="faq" className="scroll-mt-20 py-16 sm:py-20 md:py-20">
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

        <section className="border-t border-white/[0.06] bg-[hsl(26_14%_5%)] py-16 sm:py-20 md:py-24">
          <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-10">
            <ScrollReveal className="mx-auto max-w-2xl text-center">
              <h2 className="font-display text-3xl font-normal leading-[1.15] tracking-[-0.02em] text-gradient-display sm:text-4xl">
                Your professional headshot is free — for now.
              </h2>
              <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed tracking-tight text-muted-foreground">
                Only 87 spots left. No credit card. No catch.
              </p>
              <WaitlistForm variant="dark" className="mx-auto mt-11 max-w-lg" />
            </ScrollReveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
