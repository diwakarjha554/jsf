"use client";

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

function Word({ children, progress, range, accent }: { children: string; progress: MotionValue<number>; range: [number, number]; accent?: boolean }) {
  const opacity = useTransform(progress, range, [0.16, 1]);
  return (
    <motion.span style={{ opacity }} className={cn("inline-block pr-[0.24em]", accent && "font-serif font-normal italic tracking-[-0.02em] text-ember-600")}>
      {children}
    </motion.span>
  );
}

/** Words light up one by one as the paragraph scrolls through the viewport (opacity only, so it stays smooth). */
export function ScrollWords({ text, accent, className }: { text: string; accent?: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.5"] });
  const words = [...text.split(" ").map((w) => ({ w, accent: false })), ...(accent ? accent.split(" ").map((w) => ({ w, accent: true })) : [])];

  if (reduce) {
    return (
      <p className={className}>
        {text} {accent && <span className="font-serif font-normal italic text-ember-600">{accent}</span>}
      </p>
    );
  }
  return (
    <p ref={ref} className={className} aria-label={`${text} ${accent ?? ""}`.trim()}>
      <span aria-hidden="true">
        {words.map((x, i) => (
          <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} accent={x.accent}>
            {x.w}
          </Word>
        ))}
      </span>
    </p>
  );
}
