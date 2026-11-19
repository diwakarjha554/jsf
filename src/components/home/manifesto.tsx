"use client";

import { useScroll } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { site } from "@/content/site";
import { ArrowIcon } from "../ui/button";
import { Accent, Container } from "../ui/layout";
import { LinePath } from "../vendor/skiper/line-path";
import { StatsCounter } from "../vendor/vengeance/stats-counter";

const facts = [
  { value: 5, prefix: "", suffix: "", label: "Focus areas, straight from our registered objectives" },
  { value: 36, prefix: "", suffix: "", label: "States & union territories we're registered to serve" },
  { value: 0, prefix: "₹", suffix: "", label: "Gateway fees: UPI goes straight to our bank account" },
  { value: 100, prefix: "", suffix: "%", label: "Of our income used only for charitable objectives" },
];

/** Readable mission statement with a decorative self-drawing line. */
export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  return (
    <section
      ref={ref}
      id="manifesto"
      data-surface="light"
      className="section-pad relative overflow-hidden bg-cream"
    >
      <LinePath
        progress={scrollYProgress}
        className="pointer-events-none absolute -right-[55%] top-[2%] w-[150%] opacity-[0.22] md:-right-[18%] md:w-[78%] lg:-right-[8%] lg:w-[62%]"
      />
      <Container className="relative">
        <h2 className="max-w-[25ch] font-display text-[clamp(2rem,1.2rem+3vw,4.4rem)] font-semibold leading-[1.12] tracking-[-0.035em] text-brand-900">
          Opportunity in India still depends on where you&apos;re born. <Accent>We want to change that.</Accent>
        </h2>

        <div className="mt-[clamp(2.25rem,1.8rem+2vw,4rem)] grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="text-lead space-y-5 text-muted" data-reveal>
            <p>
              {site.name} was set up in Delhi in {site.legal.incorporatedYear} by people who believe a good education, good
              health and a caring community should never be a matter of luck.
            </p>
            <p>
              We work where the need is greatest: children at risk of missing school, families who can&apos;t afford care,
              women and elders who need support, and neighbourhoods that want to keep their traditions alive.
            </p>
            <Link href="/about" className="group inline-flex items-center gap-2 font-semibold text-brand-800">
              Read our story <ArrowIcon />
            </Link>
          </div>
          <dl className="grid grid-cols-1 gap-x-10 min-[400px]:grid-cols-2">
            {facts.map((f, i) => (
              <div key={f.label} className="border-t border-brand-900/15 py-5" data-reveal style={{ "--d": `${i * 80}ms` } as React.CSSProperties}>
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <StatsCounter
                    value={f.value}
                    prefix={f.prefix}
                    suffix={f.suffix}
                    className="block font-display text-[clamp(2.6rem,2rem+2.4vw,4.5rem)] font-semibold leading-none tracking-[-0.04em] text-brand-900"
                  />
                  <span className="mt-3 block max-w-[24ch] text-[15px] leading-snug text-muted">{f.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  );
}
