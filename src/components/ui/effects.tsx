"use client";

import { useEffect } from "react";

const nf = new Intl.NumberFormat("en-IN");

function animateCount(el: HTMLElement) {
  const target = Number(el.dataset.count);
  if (!Number.isFinite(target)) return;
  const prefix = el.dataset.prefix ?? "";
  const suffix = el.dataset.suffix ?? "";
  const duration = 1600;
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = `${prefix}${nf.format(Math.round(target * eased))}${suffix}`;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/**
 * Site-wide motion, with no React state:
 * - [data-reveal]: optional entrance motion; content is never hidden while waiting.
 * - [data-count]: counts numbers up when they first appear.
 * - [data-spotlight]: a soft light that follows the pointer.
 * - #site-header: gets data-scrolled="true" after the page scrolls.
 * Content is fully visible without JavaScript; motion is skipped for reduced-motion users.
 */
export function SiteEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const prepared = new WeakSet<Element>();
    const animations = new Set<Animation>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          if (el.hasAttribute("data-reveal") && !reduce) {
            // No hidden CSS state can survive Strict Mode cleanup or route restoration.
            const animation = el.animate(
              [{ transform: "translateY(12px)" }, { transform: "translateY(0)" }],
              { duration: 500, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
            );
            animations.add(animation);
            animation.onfinish = () => animations.delete(animation);
          }
          if (el.dataset.count && !el.dataset.counted) {
            el.dataset.counted = "true";
            animateCount(el);
          }
          io.unobserve(el);
        }
      },
      { threshold: 0 },
    );

    const prepare = () => {
      const vh = window.innerHeight;
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        if (prepared.has(el)) return;
        prepared.add(el);
        if (reduce) return;
        if (el.getBoundingClientRect().top > vh * 0.95) {
          io.observe(el);
        }
      });
      document.querySelectorAll<HTMLElement>("[data-count]:not([data-counted])").forEach((el) => {
        if (!reduce) io.observe(el);
      });
    };

    prepare();
    let frame = 0;
    const mo = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        prepare();
        update();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    const onPointer = (e: PointerEvent) => {
      const card = (e.target as Element | null)?.closest?.<HTMLElement>("[data-spotlight]");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    document.addEventListener("pointermove", onPointer, { passive: true });

    // Header: "scrolled" state, and light/dark tone from the section underneath it ([data-surface]).
    const header = document.getElementById("site-header");
    let ticking = false;
    const update = () => {
      ticking = false;
      if (!header) return;
      header.setAttribute("data-scrolled", window.scrollY > 12 ? "true" : "false");
      const r = header.getBoundingClientRect();
      const under = document.elementFromPoint(window.innerWidth / 2, Math.min(window.innerHeight - 1, r.bottom + 2));
      const tone = under?.closest?.("[data-surface]")?.getAttribute("data-surface") ?? "light";
      header.setAttribute("data-tone", tone === "dark" ? "dark" : "light");
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("pageshow", onScroll);

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(frame);
      animations.forEach((animation) => animation.cancel());
      document.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pageshow", onScroll);
    };
  }, []);

  return null;
}
