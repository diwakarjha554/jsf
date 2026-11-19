"use client";

/**
 * Responsive expanding panels, adapted from Skiper UI "Skiper 52".
 * Skiper UI — https://skiper-ui.com — free version, attribution required.
 * Author: @gurvinder-singh02. Mobile panels use natural content height so
 * long titles and buttons remain readable at narrow widths and larger text sizes.
 */
import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ExpandPanel = {
  key: string;
  label: string;
  icon: ReactNode;
  background: ReactNode;
  content: ReactNode;
};

export function HoverExpand({ panels, initial = 0, className }: { panels: ExpandPanel[]; initial?: number; className?: string }) {
  const [active, setActive] = useState(initial);
  const id = useId();

  return (
    <div className={cn("flex flex-col gap-3 md:min-h-[36rem] md:flex-row", className)}>
      {panels.map((p, i) => {
        const isActive = active === i;
        return (
          <div
            key={p.key}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse" && window.matchMedia("(min-width: 768px)").matches) setActive(i);
            }}
            style={{ flexGrow: isActive ? 7 : 1 }}
            className="group relative min-h-20 min-w-0 overflow-hidden rounded-3xl text-white transition-[flex-grow] duration-500 motion-reduce:transition-none md:basis-0"
          >
            <div className="pointer-events-none absolute inset-0" aria-hidden="true">{p.background}</div>
            <div className={cn("pointer-events-none absolute inset-0", isActive ? "bg-linear-to-t from-black/80 via-black/45 to-black/15" : "bg-black/40")} aria-hidden="true" />
            <button
              type="button"
              onClick={() => setActive(i)}
              onFocus={() => setActive(i)}
              aria-expanded={isActive}
              aria-controls={`${id}-${p.key}`}
              aria-label={`Show ${p.label}`}
              className={cn(
                "absolute inset-0 z-[2] flex items-center gap-3 px-5 text-left focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-sun-300 md:flex-col-reverse md:justify-start md:px-0 md:py-6",
                isActive && "pointer-events-none",
              )}
            >
              <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/30", isActive && "invisible")}>{p.icon}</span>
              <span className={cn("font-display text-lg font-semibold md:[writing-mode:vertical-rl] md:rotate-180", isActive && "invisible")}>{p.label}</span>
            </button>
            <div id={`${id}-${p.key}`} hidden={!isActive} className="relative z-[3] p-6 pt-8 sm:p-8 md:min-h-[36rem] lg:p-10">
              {isActive && <div className="flex min-h-80 flex-col justify-end md:min-h-[32rem]">{p.content}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
