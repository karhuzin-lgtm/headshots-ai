import Image from "next/image";
import Link from "next/link";

const styles = [
  {
    id: "linkedin",
    name: "LinkedIn",
    src: "/avatars/avatar-07.jpg",
    tagline: "Gets you interviews",
  },
  {
    id: "corporate",
    name: "Corporate",
    src: "/avatars/avatar-05.jpg",
    tagline: "Boardroom ready",
  },
  {
    id: "executive",
    name: "Executive",
    src: "/avatars/avatar-19.jpg",
    tagline: "Commands the room",
  },
  {
    id: "tech",
    name: "Tech",
    src: "/avatars/avatar-08.jpg",
    tagline: "Built for builders",
  },
  {
    id: "creative",
    name: "Creative",
    src: "/avatars/avatar-06.jpg",
    tagline: "Stands out",
  },
  {
    id: "startup",
    name: "Startup",
    src: "/avatars/avatar-14.jpg",
    tagline: "Founder energy",
  },
];

export function StylesSection() {
  return (
    <section id="styles" className="relative overflow-hidden bg-[#0a0a1a] py-24 text-white">
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
      <div className="absolute -right-20 bottom-16 h-80 w-80 rounded-full bg-purple-500/25 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-200/60">
            6 Styles
          </p>
          <h2 className="mt-4 text-5xl font-extrabold tracking-[-0.05em] sm:text-6xl">
            Pick yours.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-white/60">
            Every style trained on your face. Looks like you, not AI.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-4 lg:grid-cols-3">
          {styles.map((style) => (
            <Link
              key={style.id}
              href={`/try?style=${style.id}`}
              className="group relative overflow-hidden rounded-3xl bg-white/[0.04] ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_80px_-42px_rgba(245,158,11,0.9)]"
              aria-label={`Start with ${style.name} style`}
            >
              <Image
                src={style.src}
                alt={`${style.name} headshot style`}
                width={720}
                height={960}
                className="aspect-[3/4] w-full object-cover object-top transition duration-500 group-hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white backdrop-blur">
                {style.name}
              </span>
              <span className="absolute bottom-4 right-4 rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white opacity-0 backdrop-blur transition duration-300 group-hover:opacity-100">
                {style.tagline}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/try"
            className="inline-flex rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#0a0a1a] shadow-[0_0_45px_-18px_rgba(245,158,11,0.9)] transition hover:-translate-y-0.5 hover:bg-amber-200"
          >
            Start free — no card needed →
          </Link>
        </div>
      </div>
    </section>
  );
}
