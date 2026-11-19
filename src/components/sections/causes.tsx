import { Heart } from "lucide-react";
import Link from "next/link";
import { causes, type Cause } from "@/content/causes";
import { cn } from "@/lib/utils";
import { Artwork } from "../ui/artwork";
import { ArrowIcon } from "../ui/button";
import { toneStyles } from "../ui/tones";

const bentoSpan: Record<string, string> = {
  education: "md:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[24rem] lg:min-h-0",
  healthcare: "lg:col-span-2",
  "social-welfare": "",
  "culture-heritage": "",
  "community-development": "lg:col-span-2",
};

function BentoCard({ cause, index }: { cause: Cause; index: number }) {
  const Icon = cause.icon;
  const big = cause.slug === "education";
  return (
    <article
      data-spotlight
      data-reveal
      style={{ "--d": `${index * 70}ms` } as React.CSSProperties}
      className={cn(
        "group relative flex min-h-[19rem] flex-col justify-end overflow-hidden rounded-[1.75rem] text-white shadow-[0_30px_60px_-40px_rgb(22_13_45/0.6)]",
        bentoSpan[cause.slug],
      )}
    >
      <Artwork
        tone={cause.tone}
        variant={((index % 3) + 1) as 1 | 2 | 3}
        fill
        className="transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/15 to-transparent" aria-hidden="true" />
      <span className="absolute left-5 top-5 z-[2] flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur-md transition duration-500 group-hover:rotate-[-8deg] group-hover:bg-white group-hover:text-brand-950 sm:left-6 sm:top-6">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div className="relative z-[2] p-5 sm:p-7">
        <h3 className={cn("font-display font-semibold leading-tight", big ? "text-[clamp(1.7rem,1.2rem+1.6vw,2.6rem)]" : "text-[clamp(1.35rem,1.1rem+0.8vw,1.75rem)]")}>
          <Link href={`/our-work/${cause.slug}`} className="after:absolute after:inset-0 after:z-[3] focus-visible:outline-none">
            {cause.title}
          </Link>
        </h3>
        <p className={cn("mt-2 max-w-md leading-relaxed text-white/85", big ? "text-lead" : "text-[15px]")}>
          {big ? cause.summary : cause.tagline}
        </p>
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sun-200">
          Explore <ArrowIcon />
        </span>
      </div>
    </article>
  );
}

/** Asymmetric bento grid of the five causes plus a "where it's needed most" tile. */
export function CauseBento() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:auto-rows-[minmax(17rem,1fr)] lg:grid-cols-4 lg:gap-5">
      {causes.map((c, i) => (
        <BentoCard key={c.slug} cause={c} index={i} />
      ))}
      <article
        data-reveal
        style={{ "--d": "350ms" } as React.CSSProperties}
        className="group relative flex min-h-[17rem] flex-col justify-between overflow-hidden rounded-[1.75rem] bg-[linear-gradient(135deg,var(--color-sun-300),var(--color-sun-500)_50%,var(--color-ember-500))] p-6 text-brand-950 sm:p-7 md:col-span-2"
      >
        <div
          className="absolute -right-16 -top-16 aspect-square w-72 animate-spin-slow opacity-50"
          style={{ backgroundImage: "repeating-radial-gradient(circle, transparent 0 22px, rgb(255 255 255 / 0.6) 22px 23.5px)" }}
          aria-hidden="true"
        />
        <Heart className="relative h-10 w-10 text-brand-950" fill="currentColor" aria-hidden="true" />
        <div className="relative">
          <h3 className="font-display text-[clamp(1.5rem,1.2rem+1vw,2.2rem)] font-semibold leading-tight">
            <Link href="/donate?cause=general" className="after:absolute after:inset-0 focus-visible:outline-none">
              Not sure where to give?
            </Link>
          </h3>
          <p className="mt-2 max-w-md leading-relaxed text-brand-950/80">
            Let us direct your gift to wherever the need is greatest right now.
          </p>
          <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-brand-950 px-5 py-3 text-sm font-semibold text-white transition group-hover:bg-brand-800">
            Give where it&apos;s needed most <ArrowIcon />
          </span>
        </div>
      </article>
    </div>
  );
}

/** Compact horizontal cause card. */
export function CauseCardCompact({ cause, index = 0 }: { cause: Cause; index?: number }) {
  const t = toneStyles[cause.tone];
  const Icon = cause.icon;
  return (
    <article
      data-reveal
      style={{ "--d": `${index * 70}ms` } as React.CSSProperties}
      className="group relative flex items-start gap-4 rounded-2xl border border-sand-dark bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_24px_50px_-30px_rgb(36_22_69/0.45)]"
    >
      <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition duration-300 group-hover:scale-110", t.chip)}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h3 className="font-display text-lg font-semibold text-brand-900">
          <Link href={`/our-work/${cause.slug}`} className="after:absolute after:inset-0">
            {cause.title}
          </Link>
        </h3>
        <p className="mt-1 text-[15px] leading-relaxed text-muted">{cause.tagline}</p>
      </div>
      <ArrowIcon className="ml-auto mt-1 shrink-0 text-brand-400" />
    </article>
  );
}
