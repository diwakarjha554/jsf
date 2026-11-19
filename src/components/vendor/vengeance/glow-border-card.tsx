/**
 * Animated conic glow border, adapted from Vengeance UI "glow-border-card".
 * Vengeance UI — https://www.vengenceui.com — MIT License, Copyright (c) 2025-2026 Ashutoshx7.
 * Changes: brand palette, fluid sizing, server component (CSS-only animation in globals.css).
 */
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

const BRAND_GLOW = ["#ffc233", "#ffae0a", "#f5532e", "#db3b17", "#9479d4", "#5b3da3", "#9479d4", "#f5532e", "#ffd15c", "#ffc233"];

export function GlowBorderCard({
  children,
  className,
  colors = BRAND_GLOW,
  duration = 7,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  colors?: string[];
  duration?: number;
  delay?: number;
}) {
  const vars: Record<string, string> = { "--glow-animation-duration": `${duration}s` };
  colors.slice(0, 10).forEach((c, i) => (vars[`--glow-color-${i + 1}`] = c));
  return (
    <div className={cn("relative isolate overflow-hidden rounded-3xl bg-white/[0.04] backdrop-blur-md", className)} style={vars as CSSProperties}>
      <div
        className="glow-conic pointer-events-none absolute -z-10 rounded-[inherit] border-[1.5px] border-solid"
        style={{ inset: 0, animationDelay: `${-delay}s` }}
        aria-hidden="true"
      />
      <div
        className="glow-conic pointer-events-none absolute -z-20 rounded-[inherit] border-[14px] border-solid opacity-40 blur-xl"
        style={{ inset: "-6px", animationDelay: `${-delay}s` }}
        aria-hidden="true"
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
