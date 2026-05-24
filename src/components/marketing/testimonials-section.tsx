import Image from "next/image";

import { SectionIntro } from "@/components/marketing/section-intro";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";

const testimonials = [
  {
    quote:
      "I updated my LinkedIn photo and got 3 recruiter messages in the same week. The quality is honestly better than my last studio shoot.",
    name: "Marcus T.",
    title: "Software Engineer · Berlin",
    avatar: "/avatars/avatar-08.jpg",
  },
  {
    quote:
      "My old headshot was from 2019. I uploaded 12 selfies and 20 minutes later had something I'm actually proud to put on my profile.",
    name: "Sara K.",
    title: "Marketing Manager · Amsterdam",
    avatar: "/avatars/avatar-creative.jpg",
  },
  {
    quote:
      "We did the whole team of 8 in one afternoon remotely. Everyone got their own style. No photographer, no coordination hell.",
    name: "David R.",
    title: "CTO · Valencia",
    avatar: "/avatars/avatar-10.jpg",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <SectionIntro title="What early access members are saying" />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <ScrollReveal key={t.name} delay={index * 0.05}>
              <blockquote className="rounded-2xl border border-gray-100 bg-[#faf8f5] p-7">
                <p className="text-[15px] font-light leading-7 text-gray-700">&ldquo;{t.quote}&rdquo;</p>
                <footer className="mt-5 flex items-center gap-3">
                  <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                    <Image
                      src={t.avatar}
                      alt={t.name}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827]">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.title}</p>
                  </div>
                </footer>
              </blockquote>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
