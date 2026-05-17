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
    body: "Receive professional portrait headshots in your chosen style. Ready to use on LinkedIn, your website, or email signature. High resolution, no watermarks.",
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
    a: "During early access, reach out to us directly and we'll make it right.",
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
    body: "Choose from 6 professional styles. Multiple variations per style — LinkedIn, website, speaking bios, and press materials.",
  },
  {
    icon: Lock,
    title: "Private by design",
    body: "Your photos are used only to train your personal model. They are never shared, never used for training other models, and deleted automatically after 30 days.",
  },
];

const comparisonRows = [
  ["Cost", "$200-$500", "Founding member launch discount"],
  ["Time to results", "1-2 weeks", "~10 minutes"],
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

const industryStats = [
  {
    number: "21x",
    label: "More profile views",
    sub: "LinkedIn profiles with professional photos vs no photo",
    source: "LinkedIn data",
  },
  {
    number: "7 sec",
    label: "First impression window",
    sub: "Time recruiters spend forming an opinion from your photo",
    source: "Psychology research",
  },
  {
    number: "$400",
    label: "Average photographer cost",
    sub: "Traditional professional headshot session price",
    source: "Industry average",
  },
  {
    number: "93%",
    label: "Say it matters",
    sub: "Professionals who believe a good headshot helps career prospects",
    source: "Survey data",
  },
];

const companyLogos = ["Google", "Spotify", "Airbnb", "McKinsey", "Goldman Sachs"];

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
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-500">
          {label}
        </p>
      )}
      <h2 className="mt-4 text-4xl font-normal tracking-tight text-[#111827] sm:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed text-gray-500">
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-white text-[#111827]">
      <header className="sticky-header sticky top-0 z-50 border-b border-gray-100 bg-white/85 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
          <Link href="/" className="font-display text-xl font-semibold tracking-[-0.03em]">
            Headshots
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-gray-600 md:flex">
            <Link href="#how-it-works" className="py-3 transition hover:text-gray-900">
              How it works
            </Link>
            <Link href="#styles" className="py-3 transition hover:text-gray-900">
              Styles
            </Link>
            <Link href="#faq" className="py-3 transition hover:text-gray-900">
              FAQ
            </Link>
          </nav>
          <Link
            href="/#waitlist"
            className="inline-flex min-h-[44px] items-center rounded-full bg-black px-5 py-2 text-sm font-semibold text-white transition hover:bg-gray-900"
          >
            Join waitlist
          </Link>
        </div>
      </header>

      <main>
        <LandingHero />
        <StylesSection />

        <section className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-28">
          <div className="relative mx-auto max-w-6xl px-5 text-center sm:px-6 lg:px-8">
            <SectionIntro
              title="See what’s possible"
              subtitle="Clean, professional portraits generated from everyday selfies."
            />
            <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
              {beforeAfterPairs.map((pair, index) => (
                <div key={pair.before} className="flex flex-col gap-3">
                  <div className="relative">
                    <Image
                      src={`${pair.before}?v=20260517-3`}
                      alt="Casual selfie before professional headshot"
                      width={540}
                      height={720}
                      className="aspect-[3/4] w-full rounded-2xl object-cover shadow-lg"
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 380px"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
                      Before
                    </span>
                  </div>
                  <div className="relative">
                    <Image
                      src={`${pair.after}?v=20260517-3`}
                      alt="AI-generated professional headshot"
                      width={540}
                      height={720}
                      className="aspect-[3/4] w-full rounded-2xl object-cover shadow-lg"
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 380px"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-black px-2.5 py-1 text-xs font-medium text-white">
                      After — AI
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-gray-100 bg-white py-10">
          <div className="mx-auto max-w-7xl px-5 text-center sm:px-6 lg:px-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
              Used by professionals at
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-semibold text-gray-300">
              {companyLogos.map((logo) => (
                <span key={logo}>{logo}</span>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-400">Based on waitlist signups</p>
          </div>
        </section>

        <section className="bg-[#f9fafb] py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionIntro
              title="The numbers don't lie."
              subtitle="Professional headshots aren't vanity — they're ROI."
            />
            <div className="mt-14 grid grid-cols-2 gap-4 lg:grid-cols-4">
              {industryStats.map((stat, index) => (
                <ScrollReveal
                  key={stat.label}
                  delay={index * 0.04}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
                >
                  <p className="text-5xl font-bold tracking-tight text-gray-900">{stat.number}</p>
                  <h3 className="mt-2 text-base font-semibold text-gray-900">{stat.label}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{stat.sub}</p>
                  <p className="mt-3 text-xs uppercase tracking-wider text-gray-400">{stat.source}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <GalleryMasonry />

        <section className="border-y border-gray-100 bg-[#f9fafb] py-12">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 text-center sm:px-6 md:grid-cols-3 md:divide-x md:divide-gray-200 lg:px-8">
            {stats.map(([value, label], index) => (
              <ScrollReveal key={value} delay={index * 0.04} className="px-6">
                <p className="font-display text-3xl font-normal tracking-tight text-[#111827]">{value}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{label}</p>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 bg-white py-16 sm:py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
            <SectionIntro label="The process" title="Three steps to studio-quality portraits" />
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <ScrollReveal
                  key={step.title}
                  delay={index * 0.06}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <p className="font-display text-[80px] font-normal leading-none tracking-tight text-gray-200">
                    {step.n}
                  </p>
                  <h3 className="mt-4 text-2xl font-normal tracking-tight text-[#111827]">{step.title}</h3>
                  <p className="mt-4 text-[15px] font-light leading-7 text-gray-500">{step.body}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <SocialProofAvatars />

        <section className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-28">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
            <div>
              <ScrollReveal>
                <h2 className="text-4xl font-normal tracking-tight text-[#111827] sm:text-5xl">
                  Why professionals choose AI headshots
                </h2>
              </ScrollReveal>
              <div className="mt-10 grid gap-7">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <ScrollReveal key={feature.title} delay={index * 0.04} className="flex gap-5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#f5f0e8] text-[#111827]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-normal tracking-tight text-[#111827]">{feature.title}</h3>
                        <p className="mt-2 text-sm font-light leading-7 text-gray-500">{feature.body}</p>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
            <ScrollReveal className="mx-auto w-full max-w-[400px] overflow-hidden rounded-3xl bg-white shadow-xl shadow-black/10">
              <Image
                src="/avatars/avatar-19.jpg"
                alt="Professional AI headshot example"
                width={800}
                height={1066}
                className="aspect-[3/4] w-full object-cover"
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 400px"
              />
            </ScrollReveal>
          </div>
        </section>

        <section className="bg-[#f9fafb] py-16 sm:py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
            <SectionIntro title="AI headshots vs. traditional photography" />
            <ScrollReveal className="mt-12">
              <div className="grid gap-3 md:hidden">
                {comparisonRows.map(([feature, traditional, ai]) => (
                  <div key={feature} className="rounded-2xl border border-gray-100 bg-white p-5 text-left shadow-sm">
                    <h3 className="text-base font-semibold text-[#111827]">{feature}</h3>
                    <div className="mt-4 grid gap-3 text-sm">
                      <div>
                        <p className="font-medium text-gray-500">Traditional photographer</p>
                        <p className="mt-1 text-gray-600">{traditional}</p>
                      </div>
                      <div>
                        <p className="font-medium text-gray-500">AI headshots</p>
                        <p className="mt-1 inline-flex items-center gap-2 font-medium text-[#111827]">
                          <Check className="h-4 w-4" />
                          {ai}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm md:block">
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-white">
                      <th className="px-6 py-5 font-semibold text-gray-500">Feature</th>
                      <th className="px-6 py-5 font-semibold text-gray-500">Traditional photographer</th>
                      <th className="px-6 py-5 font-semibold text-[#111827]">AI headshots</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map(([feature, traditional, ai], index) => (
                      <tr key={feature} className={index % 2 === 0 ? "bg-gray-50/70" : "bg-white"}>
                        <td className="px-6 py-5 font-medium text-[#111827]">{feature}</td>
                        <td className="px-6 py-5 text-gray-500">{traditional}</td>
                        <td className="px-6 py-5 font-medium text-[#111827]">
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

        <section id="faq" className="scroll-mt-24 bg-white py-16 sm:py-20 md:py-28">
          <div className="mx-auto max-w-4xl px-5 sm:px-6 lg:px-8">
            <SectionIntro title="Frequently asked questions" />
            <div className="mt-12 divide-y divide-gray-100 rounded-3xl border border-gray-100 bg-white px-6 shadow-sm">
              {faqItems.map((item) => (
                <ScrollReveal key={item.q} className="py-6">
                  <h3 className="text-xl font-normal tracking-tight text-[#111827]">{item.q}</h3>
                  <p className="mt-3 text-sm font-light leading-7 text-gray-500">{item.a}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="waitlist" className="relative scroll-mt-24 overflow-hidden bg-gray-950 px-5 py-16 text-center text-white sm:px-6 sm:py-20 md:py-28">
          <ScrollReveal className="mx-auto max-w-2xl">
            <Timer className="mx-auto h-8 w-8 text-white/50" />
            <h2 className="mt-6 text-4xl font-extrabold tracking-[-0.035em] sm:text-5xl">
              Your professional headshot is one upload away.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg font-light leading-relaxed text-white/60">
              Join early access. We&apos;ll email you as soon as your spot opens.
            </p>
            <WaitlistForm variant="dark" showLabel={false} className="mx-auto mt-9 max-w-[480px]" />
            <p className="mt-4 text-sm text-white/70">Founding members who join now get 40% off when we launch.</p>
          </ScrollReveal>
        </section>
      </main>

      <footer className="border-t border-gray-100 bg-gray-50 px-6 py-12 text-gray-500">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-xl font-normal tracking-tight text-[#111827]">Headshots</p>
          <div className="flex flex-wrap gap-5 text-sm">
            <Link href="#" className="transition hover:text-gray-900">
              Privacy
            </Link>
            <Link href="#" className="transition hover:text-gray-900">
              Terms
            </Link>
            <a href="mailto:aleksei@alekseimedia.com" className="transition hover:text-gray-900">
              Contact: aleksei@alekseimedia.com
            </a>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-7xl text-xs text-gray-500">© 2026 Aleksei Media. All rights reserved.</p>
      </footer>
    </div>
  );
}
