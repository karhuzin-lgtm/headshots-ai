/**
 * Headshot generation runs on Astria.ai (see astria.ts).
 * This module re-exports the public API for callers that import from @/lib/fal.
 */
export {
  createAstrinaTune,
  EXPECTED_HEADSHOT_COUNT,
  generateHeadshots,
  HEADSHOT_STYLES,
  IMAGES_PER_STYLE,
  type HeadshotStyle,
} from "./astria";
