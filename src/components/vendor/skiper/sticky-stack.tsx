"use client";

/**
 * Scroll-stacking sticky cards, adapted from Skiper UI "Skiper 16" (StickyCard_001).
 * Skiper UI — https://skiper-ui.com — free version: "Free to use and modify in both personal and
 * commercial projects. Attribution to Skiper UI is required." Author: @gurvinder-singh02.
 * Changes: cards pin just below the header and stack in normal flow (no full-screen wrappers, so
 * no empty gaps), each earlier card scales back slightly; plain stack on phones.
 */
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";

function StickyCard({
  index,
  progress,
  range,
  targetScale,
  children,
}: {
  index: number;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  children: ReactNode;
}) {
  const scale = useTransform(progress, range, [1, targetScale]);
  return (
    <motion.div
      style={{ scale, top: `calc(6rem + ${index * 1.5}rem)` }}
      className="origin-top will-change-transform max-md:transform-none! md:sticky motion-reduce:static motion-reduce:transform-none!"
    >
      {children}
    </motion.div>
  );
}

export function StickyStack({ cards }: { cards: ReactNode[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 96px", "end end"] });

  return (
    <div ref={ref} className="relative flex flex-col gap-5 md:gap-10">
      {cards.map((card, i) => (
        <StickyCard
          key={i}
          index={i}
          progress={scrollYProgress}
          range={[i / cards.length, 1]}
          targetScale={Math.max(0.88, 1 - (cards.length - i - 1) * 0.04)}
        >
          {card}
        </StickyCard>
      ))}
    </div>
  );
}
