import { Camera, Check, Lock, Sparkles, Timer, Wand2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { WaitlistForm } from "@/components/WaitlistForm";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

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

const styleCards = [
  {
    name: "LinkedIn",
    description: "Light blue shirt, neutral gray background. Perfect for job seekers and consultants.",
    src: "/woman2-after.jpg",
  },
  {
    name: "Corporate",
    description: "Navy suit, professional studio lighting. Ideal for executives and business professionals.",
    src: "/man-after.jpg?v=20260517-2",
  },
  {
    name: "Executive",
    description: "Charcoal jacket, dramatic dark backdrop. For senior leaders and C-suite profiles.",
    src: "/exec-after.jpg",
  },
  {
    name: "Tech",
    description: "Dark crewneck, blurred modern office. Perfect for engineers, PMs, and startup founders.",
    src: "/man-after.jpg?v=20260517-2",
  },
  {
    name: "Creative",
    description: "Smart casual blazer, warm natural light. For designers, marketers, and creative professionals.",
    src: "/woman2-after.jpg",
  },
  {
    name: "Startup",
    description: "Clean t-shirt, minimal white background. Authentic, approachable, modern.",
    src: "/exec-after.jpg",
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
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--text-3)]">
          {label}
        </p>
      )}
      <h2 className="mt-4 text-4xl font-extrabold tracking-[-0.035em] text-[color:var(--text-1)] sm:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-[color:var(--text-2)]">
          {subtitle}
        </p>
      )}
    </ScrollReveal>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-dvh bg-white text-[color:var(--text-1)]">
      <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-white/85 backdrop-blur-2xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link href="/" className="font-display text-xl font-semibold tracking-[-0.03em]">
            Headshots
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-[color:var(--text-2)] md:flex">
            <Link href="#how-it-works" className="transition hover:text-black">
              How it works
            </Link>
            <Link href="#styles" className="transition hover:text-black">
              Styles
            </Link>
            <Link href="#faq" className="transition hover:text-black">
              FAQ
            </Link>
          </nav>
          <Link
            href="#waitlist"
            className="rounded-full bg-[#0a0a0a] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#222]"
          >
            Join waitlist
          </Link>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-white pb-24 pt-[120px]">
          <div className="absolute inset-x-0 top-0 -z-0 h-[520px] bg-[radial-gradient(circle_at_50%_0%,#f3f4f6,transparent_58%)]" />
          <div className="relative z-10 mx-auto max-w-7xl px-5 text-center lg:px-8">
            <ScrollReveal>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--text-3)]">
                AI professional headshots
              </p>
              <h1 className="mx-auto mt-6 max-w-4xl text-[42px] font-extrabold leading-[0.96] tracking-[-0.03em] text-[color:var(--text-1)] sm:text-6xl lg:text-[72px]">
                Professional headshots.
                <br />
                In 10 minutes.
              </h1>
              <p className="mx-auto mt-7 max-w-xl text-lg font-light leading-relaxed text-[color:var(--text-2)] sm:text-xl">
                Upload your selfies. Our AI trains a personal model on your face and generates studio-quality portraits across 6 professional styles. No photographer. No studio.
              </p>
            </ScrollReveal>

            <ScrollReveal className="mx-auto mt-9 max-w-[480px]" delay={0.08}>
              <WaitlistForm showLabel={false} />
              <p className="mt-4 text-sm text-[color:var(--text-3)]">
                Free for early users · Results in ~10 minutes · No credit card
              </p>
            </ScrollReveal>

            <ScrollReveal className="mt-16" delay={0.14}>
              <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
                <div className="relative w-[220px] overflow-hidden rounded-2xl border border-[color:var(--border)] bg-gray-100">
                  <Image
                    src="/man-before.jpg?v=20260517-2"
                    alt="Before casual selfie"
                    width={440}
                    height={586}
                    className="aspect-[3/4] w-full object-cover opacity-80 grayscale"
                    priority
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-500">
                    Before
                  </span>
                </div>
                <div className="font-display text-4xl font-semibold text-[color:var(--text-3)]">
                  -&gt;
                </div>
                <div className="relative w-[220px] -translate-y-2 overflow-hidden rounded-2xl border border-[color:var(--border)] bg-white shadow-[0_30px_80px_-35px_rgba(15,23,42,0.55)]">
                  <Image
                    src="/man-after.jpg?v=20260517-2"
                    alt="After AI generated headshot"
                    width={440}
                    height={586}
                    className="aspect-[3/4] w-full object-cover"
                    priority
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-black px-3 py-1 text-xs font-medium text-white">
                    After - AI
                  </span>
                </div>
              </div>
              <p className="mt-5 text-sm font-medium text-[color:var(--text-2)]">See what&apos;s possible</p>
            </ScrollReveal>
          </div>
        </section>

        <section className="bg-[color:var(--bg-soft)] py-12">
          <div className="mx-auto grid max-w-6xl gap-8 px-5 text-center md:grid-cols-3 md:divide-x md:divide-[color:var(--border)] lg:px-8">
            {stats.map(([value, label], index) => (
              <ScrollReveal key={value} delay={index * 0.04} className="px-6">
                <p className="font-display text-3xl font-bold tracking-[-0.03em]">{value}</p>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--text-2)]">{label}</p>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="scroll-mt-24 bg-white py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionIntro label="The process" title="Three steps to studio-quality portraits" />
            <div className="mt-16 grid gap-8 md:grid-cols-3">
              {steps.map((step, index) => (
                <ScrollReveal
                  key={step.title}
                  delay={index * 0.06}
                  className="rounded-[2rem] border border-transparent p-2 transition hover:border-[color:var(--border)] hover:bg-white hover:shadow-[0_24px_70px_-45px_rgba(15,23,42,0.35)]"
                >
                  <p className="font-display text-[80px] font-extrabold leading-none tracking-[-0.06em] text-[#e5e7eb]">
                    {step.n}
                  </p>
                  <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em]">{step.title}</h3>
                  <p className="mt-4 text-[15px] font-light leading-7 text-[color:var(--text-2)]">{step.body}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="styles" className="scroll-mt-24 bg-[color:var(--bg-soft)] py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <SectionIntro
              label="6 professional styles"
              title="Pick the look that fits your brand"
              subtitle="Every style generates 3 unique portrait variations so you always have options."
            />
            <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {styleCards.map((style, index) => (
                <ScrollReveal
                  key={style.name}
                  delay={index * 0.04}
                  className="group rounded-2xl border border-[color:var(--border)] bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gray-200/70"
                >
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
                    <Image
                      src={style.src}
                      alt={`${style.name} professional style`}
                      width={520}
                      height={690}
                      className="aspect-[3/4] w-full object-cover transition duration-500 group-hover:scale-105"
                      sizes="(max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="mt-5 flex items-start justify-between gap-4">
                    <h3 className="text-lg font-semibold tracking-[-0.02em]">{style.name}</h3>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-[color:var(--text-2)]">
                      Included
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-light leading-6 text-[color:var(--text-2)]">{style.description}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1fr_0.85fr] lg:px-8">
            <div>
              <ScrollReveal>
                <h2 className="text-4xl font-extrabold tracking-[-0.035em] sm:text-5xl">
                  Why professionals choose AI headshots
                </h2>
              </ScrollReveal>
              <div className="mt-10 grid gap-7">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <ScrollReveal key={feature.title} delay={index * 0.04} className="flex gap-5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gray-100 text-black">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold tracking-[-0.025em]">{feature.title}</h3>
                        <p className="mt-2 text-sm font-light leading-7 text-[color:var(--text-2)]">{feature.body}</p>
                      </div>
                    </ScrollReveal>
                  );
                })}
              </div>
            </div>
            <ScrollReveal className="mx-auto w-full max-w-[400px] overflow-hidden rounded-2xl border border-[color:var(--border)] bg-gray-100 shadow-[0_30px_80px_-45px_rgba(15,23,42,0.5)]">
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

        <section className="bg-[color:var(--bg-soft)] py-24">
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <SectionIntro title="AI headshots vs. traditional photography" />
            <ScrollReveal className="mt-12 overflow-hidden rounded-3xl border border-[color:var(--border)] bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-[color:var(--border)] bg-white">
                      <th className="px-6 py-5 font-semibold text-[color:var(--text-3)]">Feature</th>
                      <th className="px-6 py-5 font-semibold text-[color:var(--text-3)]">Traditional photographer</th>
                      <th className="px-6 py-5 font-semibold text-[color:var(--text-1)]">AI headshots</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map(([feature, traditional, ai], index) => (
                      <tr key={feature} className={index % 2 === 0 ? "bg-gray-50/70" : "bg-white"}>
                        <td className="px-6 py-5 font-medium">{feature}</td>
                        <td className="px-6 py-5 text-[color:var(--text-2)]">{traditional}</td>
                        <td className="px-6 py-5 font-medium text-[color:var(--text-1)]">
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

        <section id="faq" className="scroll-mt-24 bg-white py-24">
          <div className="mx-auto max-w-4xl px-5 lg:px-8">
            <SectionIntro title="Frequently asked questions" />
            <div className="mt-12 divide-y divide-[color:var(--border)] rounded-3xl border border-[color:var(--border)] bg-white px-6">
              {faqItems.map((item) => (
                <ScrollReveal key={item.q} className="py-6">
                  <h3 className="text-xl font-semibold tracking-[-0.025em]">{item.q}</h3>
                  <p className="mt-3 text-sm font-light leading-7 text-[color:var(--text-2)]">{item.a}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section id="waitlist" className="scroll-mt-24 bg-[#0a0a0a] px-6 py-24 text-center text-white">
          <ScrollReveal className="mx-auto max-w-2xl">
            <Timer className="mx-auto h-8 w-8 text-white/50" />
            <h2 className="mt-6 text-4xl font-extrabold tracking-[-0.035em] sm:text-5xl">
              Your professional headshot is one upload away.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg font-light leading-relaxed text-white/60">
              Join early access - free for the first users. No credit card needed.
            </p>
            <WaitlistForm variant="dark" showLabel={false} className="mx-auto mt-9 max-w-[480px]" />
            <p className="mt-4 text-sm text-white/40">We&apos;ll email you a link to try it for free. No spam.</p>
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
            <a href="mailto:hello@alekseimedia.com" className="transition hover:text-white">
              Contact: hello@alekseimedia.com
            </a>
          </div>
        </div>
        <p className="mx-auto mt-8 max-w-7xl text-xs text-white/35">© 2025 Aleksei Media. All rights reserved.</p>
      </footer>
    </div>
  );
}
