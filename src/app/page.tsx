import { Camera, Check, Lock, Sparkles, Timer, Wand2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { WaitlistForm } from "@/components/WaitlistForm";
import { GalleryMasonry } from "@/components/marketing/gallery-masonry";
import { LandingHero } from "@/components/marketing/landing-hero";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { SocialProofAvatars } from "@/components/marketing/social-proof-avatars";
import { StylesSection } from "@/components/marketing/styles-section";

const steps = [
  {
    n: "1",
    title: "Upload your selfies",
    body: "Gather 8 to 20 casual photos from your phone. Good lighting, facing the camera, no heavy filters. Taken over time from different angles.",
  },
  {
    n: "2",
    title: "AI trains on your face",
    body: "We build a private AI model trained specifically on you - not a generic face. This takes about 10 minutes. Your data stays secure and private.",
  },
  {
    n: "3",
    title: "Download your headshots",
    body: "Receive 3 professional portrait variations in your chosen style. Ready to use on LinkedIn, your website, or email signature. High resolution, no watermarks.",
  },
];

const faqItems = [
  {
    q: "How many photos do I need to upload?",
    a: "We recommend 8 to 20 photos for the best results. Casual selfies work perfectly - just make sure your face is clearly visible and well-lit. The more variety in angles and expressions, the better.",
  },
  {
    q: "What file formats and sizes are supported?",
    a: "We accept JPG, PNG, WebP, and HEIC files. Each photo can be up to 10MB. Smartphone photos are perfect.",
  },
  {
    q: "How long does the process take?",
    a: "From upload to results is approximately 10 minutes. We will send you an email as soon as your headshots are ready - no need to keep the tab open.",
  },
  {
    q: "Are my photos stored permanently?",
    a: "No. Your uploaded photos and the AI model trained on your face are automatically deleted after 30 days. We never use your data to train other models.",
  },
  {
    q: "Can I use these photos commercially?",
    a: "Yes. You own the generated headshots and can use them for LinkedIn, your website, business cards, press materials, or anything else.",
  },
  {
    q: "What if I don't like the results?",
    a: "During the early access period, we offer free regeneration if you are not satisfied. Just reach out.",
  },
];

const stats = [
  ["10 minutes", "From upload to results"],
  ["6 styles", "LinkedIn, Corporate, Executive, Tech, Creative, Startup"],
  ["Private & secure", "Your model is deleted after 30 days"],
];

const features = [
  {
    icon: Camera,
    title: "Studio quality without the studio",
    body: "Traditional headshots cost $200-$500 and require scheduling a photographer. AI delivers the same quality in minutes, at a fraction of the cost.",
  },
  {
    icon: Sparkles,
    title: "Trained on your face specifically",
    body: "Unlike generic AI filters, we train a personal model on your photos. The result looks like you - not an average of thousands of faces.",
  },
  {
    icon: Wand2,
    title: "Multiple looks from one session",
    body: "Get 3 variations per style, across up to 6 styles. Mix and match for LinkedIn, your website, speaking bios, and press materials.",
  },
  {
    icon: Lock,
    title: "Private by design",
    body: "Your photos are used only to train your personal model. They are never shared, never used for training other models, and deleted automatically after 30 days.",
  },
];

const comparisonRows = [
  ["Cost", "$200-$500", "Free (early access)"],
  ["Time to results", "1-2 weeks", "~10 minutes"],
  ["Scheduling required", "Yes", "No"],
  ["Multiple styles", "Usually 1 look", "6 professional styles"],
  ["Reshoots", "Extra cost", "Included"],
  ["Location", "Must travel to studio", "From anywhere"],
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
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c9a96e]/70">
          {label}
        </p>
      )}
      <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-white/60">
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-[#0a0a0a] text-white">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="font-display text-xl font-semibold tracking-[-0.03em]">
            Headshots
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-white/60 md:flex">
            <Link href="#how-it-works" className="transition hover:text-white">
              How it works
            </Link>
            <Link href="#styles" className="transition hover:text-white">
              Styles
            </Link>
            <Link href="#faq" className="transition hover:text-white">
              FAQ
            </Link>
          </nav>
          <Link
            href="#waitlist"
            className="rounded-full bg-[#c9a96e] px-5 py-2.5 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-[#d7bb83]"
          >
            Join waitlist
          </Link>
        </div>
      </header>

      <main>
        <LandingHero />
        <StylesSection />

        <section className="relative overflow-hidden bg-[#0a0a0a] py-24">
          <div className="relative mx-auto max-w-6xl px-5 text-center lg:px-8">
            <SectionIntro
              title="See what's possible"
              subtitle="Your casual selfie becomes a polished professional portrait with color, depth, and studio-grade light."
            />
            <div className="mt-14 flex flex-col items-center justify-center gap-8 sm:flex-row">
              <div className="relative w-[240px] overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.04]">
                <Image
                  src="/man-before.jpg?v=20260517-2"
                  alt="Before casual selfie"
                  width={520}
                  height={690}
                  className="aspect-[3/4] w-full object-cover opacity-80 grayscale"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-600">
                  Before
                </span>
              </div>
              <div className="font-display text-5xl font-extrabold text-[#c9a96e]">
                →
              </div>
              <div className="relative w-[270px] overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.04] shadow-[0_24px_70px_-50px_rgba(201,169,110,0.55)]">
                <Image
                  src="/man-after.jpg?v=20260517-2"
                  alt="After AI generated headshot"
                  width={540}
                  height={720}
                  className="aspect-[3/4] w-full object-cover"
                />
                <span className="absolute left-4 top-4 rounded-full bg-[#c9a96e] px-3 py-1 text-xs font-bold text-black shadow-[0_0_32px_-8px_rgba(201,169,110,0.8)]">
                  After - AI
                </span>
                <span className="absolute right-4 top-16 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  +AI
                </span>
              </div>
            </div>
          </div>
        </section>

        <GalleryMasonry />

        <section className="border-y border-white/10 bg-[#111111] py-12">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 text-center md:grid-cols-3 md:divide-x md:divide-white/10 lg:px-8">
            {stats.map(([value, label], index) => (
              <ScrollReveal key={value} delay={index * 0.04} className="px-6">
                <p className="font-display text-3xl font-bold tracking-[-0.03em] text-white">{value}</p>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{label}</p>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 bg-[#0a0a0a] py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionIntro label="The process" title="Three steps to studio-quality portraits" />
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <ScrollReveal
                  key={step.title}
                  delay={index * 0.06}
                  className="glass-card rounded-[2rem] p-6 transition hover:-translate-y-1"
                >
                  <p className="font-display text-[80px] font-extrabold leading-none tracking-[-0.06em] text-[#c9a96e]">
                    {step.n}
                  </p>
                  <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em] text-white">{step.title}</h3>
                  <p className="mt-4 text-[15px] font-light leading-7 text-white/58">{step.body}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <SocialProofAvatars />

        <section className="relative overflow-hidden bg-[#111111] py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1fr_0.85fr] lg:px-8">
            <div>
              <ScrollReveal>
                <h2 className="text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">
                  Why professionals choose AI headshots
                </h2>
              </ScrollReveal>
              <div className="mt-10 grid gap-7">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <ScrollReveal key={feature.title} delay={index * 0.04} className="flex gap-5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#c9a96e]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold tracking-[-0.025em] text-white">{feature.title}</h3>
                        <p className="mt-2 text-sm font-light leading-7 text-white/58">{feature.body}</p>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
            <ScrollReveal className="glass-card mx-auto w-full max-w-[400px] overflow-hidden rounded-3xl">
              <Image
                src="/exec-after.jpg"
                alt="Professional AI headshot example"
                width={800}
                height={1066}
                className="aspect-[3/4] w-full object-cover"
              />
            </ScrollReveal>
          </div>
        </section>

        <section className="bg-[#0a0a0a] py-24">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <SectionIntro title="AI headshots vs. traditional photography" />
            <ScrollReveal className="glass-card mt-12 overflow-hidden rounded-3xl">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 bg-white/[0.03]">
                      <th className="px-6 py-5 font-semibold text-white/45">Feature</th>
                      <th className="px-6 py-5 font-semibold text-white/45">Traditional photographer</th>
                      <th className="px-6 py-5 font-semibold text-white">AI headshots</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map(([feature, traditional, ai], index) => (
                      <tr key={feature} className={index % 2 === 0 ? "bg-white/[0.03]" : "bg-transparent"}>
                        <td className="px-6 py-5 font-medium text-white">{feature}</td>
                        <td className="px-6 py-5 text-white/55">{traditional}</td>
                        <td className="px-6 py-5 font-medium text-[#c9a96e]">
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

        <section id="faq" className="scroll-mt-24 bg-[#111111] py-24">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <SectionIntro title="Frequently asked questions" />
            <div className="glass-card mt-12 divide-y divide-white/10 rounded-3xl px-6">
              {faqItems.map((item) => (
                <ScrollReveal key={item.q} className="py-6">
                  <h3 className="text-xl font-semibold tracking-[-0.025em] text-white">{item.q}</h3>
                  <p className="mt-3 text-sm font-light leading-7 text-white/58">{item.a}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="waitlist" className="relative scroll-mt-24 overflow-hidden bg-[#0f0f0f] px-6 py-28 text-center text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,hsl(36_30%_20%/0.18),transparent_52%)]" />
          <ScrollReveal className="mx-auto max-w-2xl">
            <Timer className="mx-auto h-8 w-8 text-white/50" />
            <h2 className="mt-6 text-4xl font-extrabold tracking-[-0.035em] sm:text-5xl">
              Your professional headshot is one upload away.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg font-light leading-relaxed text-white/60">
              Join early access, then upload 8-20 selfies. We&apos;ll generate your first AI headshots free - no credit card needed.
            </p>
            <WaitlistForm variant="dark" showLabel={false} className="mx-auto mt-9 max-w-[480px]" />
            <p className="mt-4 text-sm text-white/40">After joining, we&apos;ll open the upload page automatically. No spam.</p>
          </ScrollReveal>
        </section>
      </main>

      <footer className="bg-[#0a0a0a] px-6 py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 border-t border-white/10 pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-xl font-semibold tracking-[-0.03em]">Headshots</p>
          <div className="flex flex-wrap gap-5 text-sm text-white/55">
            <Link href="#" className="transition hover:text-white">
              Privacy
            </Link>
            <Link href="#" className="transition hover:text-white">
              Terms
            </Link>
            <a href="mailto:aleksei@alekseimedia.com" className="transition hover:text-white">
              Contact: aleksei@alekseimedia.com
            </a>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-7xl text-xs text-white/35">© 2025 Aleksei Media. All rights reserved.</p>
      </footer>
    </div>
  );
}
