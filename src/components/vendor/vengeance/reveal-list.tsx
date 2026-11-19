"use client";

/**
 * Editorial list with a floating preview that follows the cursor.
 * Adapted from Vengeance UI "image-reveal-list" (https://www.vengenceui.com — MIT License,
 * Copyright (c) 2025-2026 Ashutoshx7), with the spring follow from Skiper UI "Skiper 61"
 * (https://skiper-ui.com — free version, attribution required).
 * Changes: large display rows, preview follows the pointer with a spring, inline thumbnails on touch.
 */
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RevealItem = { key: string; number: string; title: string; subtitle: string; body: string; preview: ReactNode };

export function RevealList({ items, className }: { items: RevealItem[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 160, damping: 20, mass: 0.4 });

  return (
    <div
      ref={ref}
      className={cn("relative", className)}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set(e.clientX - r.left);
        y.set(e.clientY - r.top);
      }}
      onPointerLeave={() => setActive(null)}
    >
      <ul className="border-t border-brand-900/12">
        {items.map((item, i) => (
          <li
            key={item.key}
            onPointerEnter={(e) => e.pointerType === "mouse" && setActive(i)}
            className="group relative border-b border-brand-900/12"
          >
            <div className="relative grid grid-cols-[auto_1fr] items-start gap-x-5 gap-y-3 py-6 transition-[padding] duration-500 sm:gap-x-8 md:grid-cols-[4rem_1.2fr_1fr] md:items-center md:py-8 md:group-hover:pl-6">
              <span className="pt-2 font-display text-sm font-semibold text-ember-600 md:pt-0">{item.number}</span>
              <div>
                <h3 className="font-display text-[clamp(1.8rem,1.1rem+2.8vw,4.2rem)] font-semibold leading-none tracking-[-0.03em] text-brand-900 transition-colors duration-300 group-hover:text-ember-600">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm font-medium text-muted">{item.subtitle}</p>
              </div>
              <p className="col-span-2 max-w-md leading-relaxed text-muted md:col-span-1 md:justify-self-end">{item.body}</p>
              <div className="col-span-2 aspect-[16/9] overflow-hidden rounded-2xl md:hidden">{item.preview}</div>
            </div>
          </li>
        ))}
      </ul>

      <motion.div
        aria-hidden="true"
        style={{ x: sx, y: sy }}
        className="pointer-events-none absolute left-0 top-0 z-10 hidden md:block"
      >
        <AnimatePresence>
          {active !== null && (
            <motion.div
              key={items[active].key}
              initial={{ opacity: 0, scale: 0.6, rotate: -6 }}
              animate={{ opacity: 1, scale: 1, rotate: -3 }}
              exit={{ opacity: 0, scale: 0.6, rotate: 0 }}
              transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
              className="-translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl shadow-[0_40px_80px_-30px_rgb(22_13_45/0.6)]"
              style={{ width: "clamp(14rem, 20vw, 20rem)", aspectRatio: "4 / 3" }}
            >
              {items[active].preview}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
