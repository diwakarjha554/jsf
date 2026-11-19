"use client";

/**
 * Count-up number, adapted from Vengeance UI "stats-counter".
 * Vengeance UI — https://www.vengenceui.com — MIT License, Copyright (c) 2025-2026 Ashutoshx7.
 * Changes: renders the real value on the server (no "0" for crawlers or no-JS), Indian digit grouping.
 */
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const nf = new Intl.NumberFormat("en-IN");

export function StatsCounter({
  value,
  duration = 1.8,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const motionValue = useMotionValue(value);
  const spring = useSpring(motionValue, { duration: duration * 1000, bounce: 0 });
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    spring.jump(0);
    motionValue.jump(0);
    motionValue.set(value);
  }, [inView, value, motionValue, spring]);

  useEffect(() => spring.on("change", (v) => setDisplay(v)), [spring]);

  return (
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {nf.format(Math.round(display))}
      {suffix}
    </span>
  );
}
