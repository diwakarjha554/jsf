"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Cycles through words in place. All words share one grid cell, so the layout never jumps. */
export function RotatingWords({
  words,
  className,
  wordClassName,
  interval = 2600,
}: {
  words: string[];
  className?: string;
  /** Applied to each word (e.g. a gradient text style, which must sit on the word itself). */
  wordClassName?: string;
  interval?: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setIndex((n) => (n + 1) % words.length), interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  const prev = (index - 1 + words.length) % words.length;
  return (
    <>
      <span className="sr-only">{words[0]}</span>
      <span className={cn("inline-grid", className)} aria-hidden="true">
        {words.map((word, i) => (
          <span
            key={word}
            className={cn(
              "col-start-1 row-start-1 whitespace-nowrap transition-all duration-700 ease-[cubic-bezier(.2,.7,.2,1)]",
              wordClassName,
              i === index && "translate-y-0 opacity-100 blur-0",
              i === prev && "-translate-y-[0.45em] opacity-0 blur-sm",
              i !== index && i !== prev && "translate-y-[0.45em] opacity-0 blur-sm",
            )}
          >
            {word}
          </span>
        ))}
      </span>
    </>
  );
}
