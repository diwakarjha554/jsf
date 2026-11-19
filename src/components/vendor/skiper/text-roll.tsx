/**
 * Letter-roll hover text, adapted from Skiper UI "Skiper 58" (TextRoll).
 * Skiper UI — https://skiper-ui.com — free version: "Free to use and modify in both personal and
 * commercial projects. Attribution to Skiper UI is required." Author: @gurvinder-singh02.
 * Changes: CSS-only (works in server components and rolls when any ancestor with `group` is hovered
 * or focused), accessible label, centre-out stagger option.
 */
import { cn } from "@/lib/utils";

const STAGGER = 0.028;

export function TextRoll({ children, className, center = false }: { children: string; className?: string; center?: boolean }) {
  const chars = children.split("");
  const delay = (i: number) => (center ? STAGGER * Math.abs(i - (chars.length - 1) / 2) : STAGGER * i);
  const layer = (top: boolean) =>
    chars.map((ch, i) => (
      <span
        key={i}
        className={cn(
          "inline-block transition-transform duration-500 ease-[cubic-bezier(.65,0,.35,1)] motion-reduce:transition-none",
          top
            ? "group-hover:-translate-y-full group-focus-visible:-translate-y-full"
            : "translate-y-full group-hover:translate-y-0 group-focus-visible:translate-y-0",
        )}
        style={{ transitionDelay: `${delay(i)}s` }}
      >
        {ch === " " ? " " : ch}
      </span>
    ));
  return (
    <span className={cn("relative inline-block overflow-hidden align-bottom leading-[1.15]", className)}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true" className="block">
        {layer(true)}
      </span>
      <span aria-hidden="true" className="absolute inset-0 block">
        {layer(false)}
      </span>
    </span>
  );
}
