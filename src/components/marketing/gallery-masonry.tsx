import Image from "next/image";

const photos = [
  "/avatars/avatar-02.jpg",
  "/avatars/avatar-03.jpg",
  "/avatars/avatar-07.jpg",
  "/avatars/avatar-08.jpg",
  "/avatars/avatar-09.jpg",
  "/avatars/avatar-10.jpg",
  "/avatars/avatar-11.jpg",
  "/avatars/avatar-12.jpg",
  "/avatars/avatar-14.jpg",
  "/avatars/avatar-16.jpg",
  "/avatars/avatar-19.jpg",
  "/avatars/avatar-21.jpg",
];

export function GalleryMasonry() {
  return (
    <section className="relative overflow-hidden bg-[#0f0f2e] py-24 text-white">
      <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-fuchsia-500/15 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">
            Over 1,000 headshots generated.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-white/60">
            Real diversity. Real results.
          </p>
        </div>

        <div className="mx-auto mt-14 max-w-6xl columns-2 gap-3 sm:columns-3 lg:columns-4">
          {photos.map((src) => (
            <Image
              key={src}
              src={src}
              alt="AI generated professional headshot"
              width={520}
              height={700}
              className="mb-3 w-full rounded-2xl object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
