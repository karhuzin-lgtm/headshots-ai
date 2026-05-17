import Image from "next/image";

const avatarSources = [
  "/man-after.jpg?v=20260517-2",
  "/exec-after.jpg",
  "/woman2-after.jpg",
  "/images/corporate.jpg",
  "/images/creative.jpg",
  "/images/fal-1778531810-1.jpg",
  "/images/fal-1778531811-1.jpg",
  "/images/fal-1778531813-1.jpg",
  "/images/fal-1778531814-1.jpg",
];

export function SocialProofAvatars() {
  const marqueeItems = [...avatarSources, ...avatarSources, ...avatarSources, ...avatarSources];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-transparent via-indigo-500/10 to-transparent py-20 text-center text-white">
      <div className="absolute left-1/2 top-1/2 h-64 w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400/10 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">
            Join professionals already on the waitlist
          </h2>
          <p className="mt-4 text-lg font-light text-white/60">
            Be among the first to get AI headshots that actually look like you.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
          <div className="animate-marquee flex w-max gap-4 py-2">
            {marqueeItems.map((src, index) => (
              <div
                key={`${src}-${index}`}
                className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-white/70 bg-white/10 shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)]"
              >
                <Image
                  src={src}
                  alt=""
                  width={96}
                  height={96}
                  className="h-full w-full object-cover"
                  sizes="64px"
                />
              </div>
            ))}
          </div>
        </div>

        <p className="mt-8 font-display text-5xl font-extrabold tracking-[-0.05em]">
          <span className="animate-gradient bg-gradient-to-r from-amber-200 via-yellow-400 to-orange-300 bg-clip-text text-transparent">
            1,200+
          </span>
        </p>
        <p className="mt-2 text-sm font-light text-white/55">
          professionals waiting to upload 8-20 selfies and get early access
        </p>
      </div>
    </section>
  );
}
