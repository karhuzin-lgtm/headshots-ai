import Image from "next/image";

const photos = [
  "/avatars/avatar-02.jpg",
  "/avatars/avatar-03.jpg",
  "/avatars/avatar-creative.jpg",
  "/avatars/avatar-07.jpg",
  "/avatars/avatar-08.jpg",
  "/avatars/avatar-09.jpg",
  "/avatars/avatar-10.jpg",
  "/avatars/avatar-11.jpg",
  "/avatars/avatar-12.jpg",
  "/avatars/avatar-14.jpg",
  "/avatars/avatar-16.jpg",
  "/avatars/avatar-19.jpg",
];

export function GalleryMasonry() {
  return (
    <section className="relative overflow-hidden bg-white py-16 text-[#111827] sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-normal tracking-tight sm:text-5xl">
            Generated for 1,200+ professionals on the waitlist.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed text-gray-500">
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
              className="mb-3 aspect-[3/4] w-full rounded-2xl object-cover shadow-sm"
              loading="lazy"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
