"use client";

import Link from "next/link";
import { useState } from "react";
import { causes, type CauseSlug } from "@/content/causes";
import { site } from "@/content/site";
import { cn, formatINR } from "@/lib/utils";
import { ArrowIcon, buttonClass } from "../ui/button";
import { toneStyles } from "../ui/tones";

const PRESETS = site.donation.presets as readonly number[];

/** Interactive: pick a cause, pick an amount, see what it does, give. */
export function ImpactExplorer() {
  const [slug, setSlug] = useState<CauseSlug>("education");
  const [amount, setAmount] = useState<number>(PRESETS[1]);
  const cause = causes.find((c) => c.slug === slug)!;
  const Icon = cause.icon;
  const t = toneStyles[cause.tone];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-8">
      <div className="min-w-0">
        <div role="tablist" aria-label="Choose a cause" className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {causes.map((c) => {
            const CIcon = c.icon;
            const active = c.slug === slug;
            return (
              <button
                key={c.slug}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setSlug(c.slug)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun-300/50",
                  active ? "border-brand-900 bg-brand-900 text-white shadow-lg shadow-brand-900/20" : "border-sand-dark bg-white text-ink hover:border-brand-300",
                )}
              >
                <CIcon className={cn("h-4 w-4", active ? "text-sun-300" : toneStyles[c.tone].text)} aria-hidden="true" />
                {c.shortTitle}
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid grid-cols-1 gap-2.5 min-[380px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3" role="radiogroup" aria-label="Choose an amount">
          {PRESETS.map((p) => {
            const active = p === amount;
            return (
              <button
                key={p}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setAmount(p)}
                className={cn(
                  "rounded-2xl border-2 px-4 py-4 text-left transition duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun-300/50",
                  active ? "border-sun-500 bg-sun-50 shadow-[0_16px_30px_-20px_rgb(230_143_0/0.8)]" : "border-sand-dark bg-white hover:border-sun-300",
                )}
              >
                <span className="block font-display text-2xl font-semibold text-brand-900">{formatINR(p)}</span>
                <span className="mt-1 line-clamp-2 block text-xs leading-snug text-muted">{cause.impact[p]}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div
        key={`${slug}-${amount}`}
        className="grain relative isolate flex min-h-[20rem] flex-col justify-between overflow-hidden rounded-[2rem] bg-mesh-dark p-6 text-white animate-fade-in sm:p-9"
        aria-live="polite"
      >
        <div
          className={cn("absolute -right-20 -top-20 -z-10 aspect-square w-80 rounded-full bg-linear-to-br opacity-70 blur-2xl", t.panel)}
          aria-hidden="true"
        />
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sun-300 ring-1 ring-white/20">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="font-semibold text-brand-100">{cause.title}</span>
        </div>
        <div className="mt-10">
          <p className="font-display text-[clamp(3rem,2rem+4vw,5.5rem)] font-semibold leading-none tracking-tight">{formatINR(amount)}</p>
          <p className="mt-4 max-w-md text-[clamp(1.15rem,1rem+0.6vw,1.6rem)] leading-snug text-brand-50">
            {cause.impact[amount]}.
          </p>
        </div>
        <div className="mt-8 flex flex-col gap-3 min-[420px]:flex-row min-[420px]:items-center">
          <Link href={`/donate?cause=${slug}&amount=${amount}`} className={buttonClass("primary", "lg")}>
            Give {formatINR(amount)}
            <ArrowIcon />
          </Link>
          <Link href={`/our-work/${slug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-100 transition hover:text-white">
            About this cause <ArrowIcon />
          </Link>
        </div>
      </div>
    </div>
  );
}
