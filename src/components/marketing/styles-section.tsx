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
    src: "/avatars/avatar-10.jpg",
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
    <section id="styles" className="relative overflow-hidden bg-[#0a0a0a] py-24 text-white">
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#c9a96e]">
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
              className="group relative aspect-[3/4] overflow-hidden rounded-3xl bg-white/[0.04] ring-1 ring-white/[0.07] transition duration-300 hover:scale-[1.03]"
              aria-label={`Start with ${style.name} style`}
            >
              <Image
                src={style.src}
                alt={`${style.name} headshot style`}
                width={720}
                height={960}
                className="h-full w-full object-cover object-top transition duration-300 group-hover:brightness-105"
                sizes="(max-width: 1024px) 50vw, 33vw"
              />
              <span className="absolute bottom-4 left-4 rounded-full bg-black/70 px-3 py-1 text-sm font-medium text-white backdrop-blur">
                {style.name}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/try"
            className="inline-flex rounded-full bg-[#c9a96e] px-7 py-3 text-sm font-semibold text-black transition hover:-translate-y-0.5 hover:bg-[#d7bb83]"
          >
            Start free — no card needed →
          </Link>
        </div>
      </div>
    </section>
  );
}
