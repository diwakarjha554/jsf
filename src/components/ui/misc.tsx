import { Plus } from "lucide-react";
import type { Faq } from "@/content/faqs";
import { cn } from "@/lib/utils";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function faqJsonLd(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/** Accessible accordion using native <details>; height animates in modern browsers. */
export function FaqList({ faqs, className }: { faqs: Faq[]; className?: string }) {
  return (
    <div className={cn("faq space-y-3", className)}>
      {faqs.map((f, i) => (
        <details
          key={f.q}
          className="group rounded-2xl border border-sand-dark bg-white transition-colors open:border-brand-200 open:bg-white open:shadow-[0_20px_50px_-30px_rgb(36_22_69/0.35)]"
          data-reveal
          style={{ "--d": `${Math.min(i, 6) * 50}ms` } as React.CSSProperties}
        >
          <summary className="flex cursor-pointer items-start justify-between gap-4 rounded-2xl px-5 py-5 text-left text-[1.02rem] font-semibold text-brand-900 sm:px-6">
            <span>{f.q}</span>
            <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sand text-brand-800 transition duration-300 group-open:rotate-45 group-open:bg-sun-400 group-open:text-brand-950">
              <Plus className="h-4 w-4" aria-hidden="true" />
            </span>
          </summary>
          <div className="px-5 pb-6 leading-relaxed text-muted sm:px-6">{f.a}</div>
        </details>
      ))}
    </div>
  );
}

export function Initials({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-linear-to-br from-brand-500 via-brand-700 to-ember-600 font-display text-3xl font-bold text-white",
        className,
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  );
}

/** Small diamond separator used in tickers and lists. */
export function Sparkle({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={cn("h-[0.6em] w-[0.6em] shrink-0", className)} aria-hidden="true">
      <path d="M12 0c1.2 6.6 5.4 10.8 12 12-6.6 1.2-10.8 5.4-12 12-1.2-6.6-5.4-10.8-12-12C6.6 10.8 10.8 6.6 12 0Z" fill="currentColor" />
    </svg>
  );
}

export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li
          key={item + i}
          className="flex items-center gap-[clamp(1.25rem,3vw,3rem)] pr-[clamp(1.25rem,3vw,3rem)] font-display text-[clamp(1.7rem,1rem+3.2vw,4.25rem)] font-bold tracking-tight whitespace-nowrap"
        >
          <span className={i % 2 ? "text-transparent [-webkit-text-stroke:1.5px_var(--color-sun-300)]" : "text-white"}>{item}</span>
          <Sparkle className="text-sun-400" />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("group flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]", className)}>
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
