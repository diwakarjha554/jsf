import type { Tone } from "@/content/causes";

/** Literal class names per cause colour (Tailwind needs full class strings at build time). */
export const toneStyles: Record<
  Tone,
  { panel: string; chip: string; text: string; soft: string; ring: string; glow: string }
> = {
  brand: {
    panel: "from-[#9b8cf8] via-brand-600 to-brand-950",
    chip: "bg-brand-100 text-brand-700",
    text: "text-brand-600",
    soft: "bg-brand-50",
    ring: "ring-brand-200",
    glow: "shadow-brand-500/30",
  },
  rose: {
    panel: "from-rose-300 via-rose-600 to-[#4c0519]",
    chip: "bg-rose-100 text-rose-700",
    text: "text-rose-600",
    soft: "bg-rose-50",
    ring: "ring-rose-200",
    glow: "shadow-rose-500/30",
  },
  amber: {
    panel: "from-sun-200 via-sun-500 to-ember-700",
    chip: "bg-sun-100 text-sun-800",
    text: "text-sun-700",
    soft: "bg-sun-50",
    ring: "ring-sun-200",
    glow: "shadow-sun-500/30",
  },
  orange: {
    panel: "from-ember-300 via-ember-600 to-[#4a1206]",
    chip: "bg-orange-100 text-ember-700",
    text: "text-ember-600",
    soft: "bg-orange-50",
    ring: "ring-orange-200",
    glow: "shadow-ember-500/30",
  },
  emerald: {
    panel: "from-emerald-300 via-emerald-600 to-[#042f2a]",
    chip: "bg-emerald-100 text-emerald-700",
    text: "text-emerald-700",
    soft: "bg-emerald-50",
    ring: "ring-emerald-200",
    glow: "shadow-emerald-500/30",
  },
  violet: {
    panel: "from-violet-300 via-violet-600 to-brand-950",
    chip: "bg-violet-100 text-violet-700",
    text: "text-violet-700",
    soft: "bg-violet-50",
    ring: "ring-violet-200",
    glow: "shadow-violet-500/30",
  },
};
