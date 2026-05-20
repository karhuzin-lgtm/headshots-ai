import Image from "next/image";
import Link from "next/link";

import { SectionIntro } from "@/components/marketing/section-intro";
import { ScrollReveal } from "@/components/marketing/scroll-reveal";
import { LANDING_GALLERY_PHOTOS } from "@/lib/landing-content";

export function GalleryMasonry() {
  return (
    <section id="gallery" className="scroll-mt-24 bg-[#080808] py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <SectionIntro
          label="Gallery"
          title="Generated for professionals on the waitlist"
          subtitle="Real faces. Real styles. LinkedIn-ready portraits from phone selfies."
        />

        <ScrollReveal className="mt-14">
          <div className="columns-2 gap-3 sm:columns-3 lg:columns-4">
            {LANDING_GALLERY_PHOTOS.map((src, index) => (
              <Image
                key={src}
                src={src}
                alt="AI-generated professional headshot example"
                width={520}
                height={700}
                className="mb-3 aspect-[3/4] w-full rounded-2xl border border-white/[0.08] object-cover object-top"
                loading={index < 4 ? "eager" : "lazy"}
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal className="mt-12 text-center" delay={0.08}>
          <Link
            href="/#waitlist"
            className="inline-flex min-h-[44px] items-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-[#f5f5f5]"
          >
            Join early access
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
