import Image from "next/image";

import { MY_STYLE_PHOTOS } from "@/lib/my-photos";

export function GalleryMasonry() {
  return (
    <section className="relative overflow-hidden bg-white py-16 text-[#111827] sm:py-20 md:py-28">
      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-normal tracking-tight sm:text-5xl">
            Six professional styles. One upload.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base font-light leading-relaxed text-gray-500">
            Real AI headshots from the same selfies — LinkedIn through Startup.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
          {MY_STYLE_PHOTOS.map((src) => (
            <Image
              key={src}
              src={src}
              alt="AI generated professional headshot"
              width={520}
              height={700}
              className="aspect-[3/4] w-full rounded-2xl object-cover object-top shadow-sm"
              loading="lazy"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
