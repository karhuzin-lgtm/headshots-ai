import { Camera, Lock, Sparkles, Wand2, type LucideIcon } from "lucide-react";

import type { ComparisonFeature } from "@/components/marketing/feature-comparison-table";

export type LandingStep = {
  n: string;
  title: string;
  body: string;
};

export type LandingFaqItem = {
  q: string;
  a: string;
};

export type LandingFeature = {
  icon: LucideIcon;
  title: string;
  body: string;
};

export type BeforeAfterPair = {
  before: string;
  after: string;
  label: string;
};

export const LANDING_STATS = [
  { value: "~15 min", label: "Upload to download" },
  { value: "6", label: "Professional styles" },
  { value: "1,200+", label: "On the waitlist" },
  { value: "40%", label: "Founding member discount" },
] as const;

export const LANDING_STEPS: LandingStep[] = [
  {
    n: "1",
    title: "Upload your selfies",
    body: "Gather 8–20 casual photos from your phone. Face the camera, good lighting, no heavy filters — variety in angles helps.",
  },
  {
    n: "2",
    title: "AI trains on your face",
    body: "We build a private model trained only on you. About 15 minutes. Your photos never train other people's models.",
  },
  {
    n: "3",
    title: "Download your headshots",
    body: "Pick your style, get high-resolution portraits with no watermarks. Ready for LinkedIn, your site, press, and email.",
  },
];

export const LANDING_FAQ: LandingFaqItem[] = [
  {
    q: "How many photos do I need to upload?",
    a: "We recommend 8 to 20 photos for the best results. Casual selfies work perfectly — just make sure your face is clearly visible and well-lit. The more variety in angles and expressions, the better.",
  },
  {
    q: "What file formats and sizes are supported?",
    a: "We accept JPG, PNG, WebP, and HEIC files. Each photo can be up to 10MB. Smartphone photos are perfect — no professional camera required.",
  },
  {
    q: "How long does the process take?",
    a: "From upload to results is approximately 15 minutes. We email you as soon as your headshots are ready — no need to keep the tab open.",
  },
  {
    q: "Are my photos stored permanently?",
    a: "No. Your uploaded photos and the AI model trained on your face are automatically deleted after 30 days. We never use your data to train models for other users.",
  },
  {
    q: "Can I use these photos commercially?",
    a: "Yes. You own the generated headshots and can use them for LinkedIn, your website, business cards, press materials, speaking bios, or anything else.",
  },
  {
    q: "What if I don't like the results?",
    a: "If you don't find at least 5 photos you'd actually use on LinkedIn — we retrain your model for free or refund every cent. Follow the selfie guide when uploading.",
  },
];

export const LANDING_FEATURES: LandingFeature[] = [
  {
    icon: Camera,
    title: "Looks like you — not like AI",
    body: "We train a private model on your face specifically. The result passes the LinkedIn test: colleagues won't know it's AI.",
  },
  {
    icon: Sparkles,
    title: "Trained on your face specifically",
    body: "Unlike generic filters, we train a personal model on your photos — not an average of thousands of faces.",
  },
  {
    icon: Wand2,
    title: "Multiple looks from one session",
    body: "Six professional styles with multiple variations each — LinkedIn, website, speaking bios, and press in one upload.",
  },
  {
    icon: Lock,
    title: "Private by design",
    body: "Your photos are never shared, never used to train other models, and deleted automatically after 30 days.",
  },
];

export const LANDING_COMPARISON: ComparisonFeature[] = [
  { name: "Cost", traditional: "$200–$500", ai: "Fraction of the cost" },
  { name: "Time to results", traditional: "1–2 weeks", ai: "~15 minutes" },
  { name: "Scheduling required", traditional: "Yes", ai: "No" },
  { name: "Multiple styles", traditional: "Usually 1 look", ai: "6 professional styles" },
  { name: "Reshoots", traditional: "Extra cost", ai: "Included" },
  { name: "Location", traditional: "Must travel to studio", ai: "From anywhere" },
];

export const LANDING_BEFORE_AFTER: BeforeAfterPair[] = [
  { before: "/man-before.jpg", after: "/man-after.jpg", label: "Tech professional" },
  { before: "/exec-before.jpg", after: "/exec-after.jpg", label: "Executive" },
  { before: "/woman2-before.jpg", after: "/woman2-after.jpg", label: "Consultant" },
];

export const LANDING_GALLERY_PHOTOS = [
  "/avatars/avatar-01.jpg",
  "/avatars/avatar-02.jpg",
  "/avatars/avatar-03.jpg",
  "/avatars/avatar-05.jpg",
  "/avatars/avatar-07.jpg",
  "/avatars/avatar-08.jpg",
  "/avatars/avatar-10.jpg",
  "/avatars/avatar-11.jpg",
  "/avatars/avatar-corporate.jpg",
  "/avatars/avatar-executive.jpg",
  "/avatars/avatar-tech.jpg",
  "/avatars/avatar-creative.jpg",
  "/avatars/avatar-startup.jpg",
  "/avatars/avatar-14.jpg",
  "/avatars/avatar-16.jpg",
  "/avatars/avatar-19.jpg",
] as const;

export const LANDING_CTA_BULLETS = [
  "Priority access when generation opens",
  "40% founding member discount at launch",
  "GPU-limited batches — quality over quantity",
] as const;

export const LANDING_NAV_LINKS = [
  { href: "#how-it-works", label: "How it works" },
  { href: "#styles", label: "Styles" },
  { href: "#faq", label: "FAQ" },
] as const;
