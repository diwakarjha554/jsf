import Link from "next/link";
import { causes } from "@/content/causes";
import { Artwork } from "../ui/artwork";
import { ArrowIcon, buttonClass } from "../ui/button";
import { HoverExpand, type ExpandPanel } from "../vendor/skiper/hover-expand";

/** The five causes as expanding panels (Skiper UI 52). Swap Artwork for photos when available. */
export function CausesExpand() {
  const panels: ExpandPanel[] = causes.map((c, i) => {
    const Icon = c.icon;
    return {
      key: c.slug,
      label: c.shortTitle,
      icon: <Icon className="h-5 w-5" aria-hidden="true" />,
      background: <Artwork tone={c.tone} variant={((i % 3) + 1) as 1 | 2 | 3} fill />,
      content: (
        <div className="max-w-xl">
          <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur-md">
            <Icon className="h-7 w-7" aria-hidden="true" />
          </span>
          <h3 className="font-display text-[clamp(1.9rem,1.3rem+2vw,3.4rem)] font-semibold leading-[1] tracking-[-0.03em]">{c.title}</h3>
          <p className="mt-4 max-w-lg text-[clamp(0.98rem,0.92rem+0.25vw,1.15rem)] leading-relaxed text-white/85">{c.summary}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={`/our-work/${c.slug}`} className={buttonClass("light", "md")}>
              Explore <ArrowIcon />
            </Link>
            <Link href={`/donate?cause=${c.slug}`} className={buttonClass("glass", "md")}>
              Donate to {c.shortTitle.toLowerCase()}
            </Link>
          </div>
        </div>
      ),
    };
  });
  return <HoverExpand panels={panels} />;
}
