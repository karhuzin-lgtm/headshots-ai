/**
 * Real AI-generated assets from /public/images (next/image paths).
 * Man pair: casual → suit / dark bg. Woman pair: casual → blazer / white bg.
 */
export const MARKETING_IMAGES = {
  man: {
    before: "/images/fal-1778531810-1.jpg",
    after: "/images/fal-1778531811-1.jpg",
  },
  woman: {
    before: "/images/fal-1778531814-1.jpg",
    after: "/images/fal-1778531813-1.jpg",
  },
} as const;

/** Avatar stack — same real generations as the hero and examples. */
export const MARKETING_AVATARS: readonly string[] = [
  MARKETING_IMAGES.man.before,
  MARKETING_IMAGES.woman.before,
  MARKETING_IMAGES.man.after,
  MARKETING_IMAGES.woman.after,
];
