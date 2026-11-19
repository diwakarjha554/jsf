"use client";

/**
 * Letters that fly in and assemble as you scroll, adapted from Skiper UI "Skiper 31" (CharacterV1).
 * Skiper UI — https://skiper-ui.com — free version: "Free to use and modify in both personal and
 * commercial projects. Attribution to Skiper UI is required." Author: @gurvinder-singh02.
 * Changes: content-sized sticky stage pinned at the viewport centre (no empty space when it releases),
 * spread scaled to the viewport, optional caption, reduced-motion aware.
 */
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

function Char({ char, index, center, progress }: { char: string; index: number; center: number; progress: MotionValue<number> }) {
  const d = index - center;
  const x = useTransform(progress, [0, 0.5], [`${d * 6}vw`, "0vw"]);
  const rotateX = useTransform(progress, [0, 0.5], [d * 36, 0]);
  const opacity = useTransform(progress, [0, 0.25], [0.15, 1]);
  return (
    <motion.span className={cn("inline-block will-change-transform", char === " " && "w-[0.3em]")} style={{ x, rotateX, opacity }}>
      {char === " " ? " " : char}
    </motion.span>
  );
}

export function ScrollAssemble({ text, className, children }: { text: string; className?: string; children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.6", "end 0.95"] });
  const captionOpacity = useTransform(scrollYProgress, [0.42, 0.62], [0, 1]);
  const captionY = useTransform(scrollYProgress, [0.42, 0.62], [24, 0]);
  const chars = text.split("");
  const center = Math.floor(chars.length / 2);

  return (
    <div ref={ref} className={cn("relative", reduce ? "" : "h-[125vh]")}>
      <div className={cn("flex flex-col items-center justify-center overflow-hidden py-[clamp(3rem,2rem+3vw,5rem)]", !reduce && "sticky top-[calc(50svh-10rem)]")}>
        <p className={className} style={{ perspective: "600px" }} aria-label={text}>
          <span aria-hidden="true">
            {chars.map((c, i) =>
              reduce ? (
                <span key={i}>{c}</span>
              ) : (
                <Char key={i} char={c} index={i} center={center} progress={scrollYProgress} />
              ),
            )}
          </span>
        </p>
        {children && <motion.div style={reduce ? undefined : { opacity: captionOpacity, y: captionY }}>{children}</motion.div>}
      </div>
    </div>
  );
}
