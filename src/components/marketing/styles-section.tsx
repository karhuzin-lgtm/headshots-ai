import Image from "next/image";
import Link from "next/link";

import { DISPLAY_STYLES } from "@/lib/display-styles";

export function StylesSection() {
  return (
    <section id="styles" className="relative overflow-hidden bg-[#f9fafb] py-20 text-[#111827] sm:py-28">
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gray-400">
            6 Styles
          </p>
          <h2 className="mt-4 text-4xl font-normal tracking-tight text-[#111827] sm:text-5xl">
            6 styles. Pick yours.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed text-gray-500">
            Every style trained on your face. Looks like you, not AI.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-5 lg:grid-cols-3">
          {DISPLAY_STYLES.map((style) => (
            <Link
              key={style.key}
              href="/#waitlist"
              className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-xl"
              aria-label={`Start with ${style.name} style`}
            >
              <Image
                src={style.photo}
                alt={`${style.name} headshot style`}
                width={720}
                height={960}
                className="aspect-[3/4] w-full object-cover object-top"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
              <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900">{style.name}</h3>
                <p className="mt-1 text-xs text-gray-500">{style.tagline}</p>
                <p className="mt-2 text-xs leading-relaxed text-gray-400">{style.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/#waitlist"
            className="inline-flex rounded-full bg-[#111827] px-7 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-black"
          >
            Get early access →
          </Link>
        </div>
      </div>
    </section>
  );
}
