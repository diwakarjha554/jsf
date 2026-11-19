"use client";

/**
 * First-visit intro, adapted from Vengeance UI "reveal-loader".
 * Vengeance UI — https://www.vengenceui.com — MIT License, Copyright (c) 2025-2026 Ashutoshx7.
 * Changes: brand palette and type, progress line, centre-out bar exit, session-once,
 * and a CSS fail-safe so the page is never hidden if JavaScript doesn't run.
 *
 * Visibility is controlled by the `intro` class on <html>, set by a tiny inline script
 * in the root layout before first paint (only on the first page of a visit).
 */
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

gsap.registerPlugin(useGSAP);

const WORD = "Jeevansphere";
const BARS = 8;

export function IntroLoader() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = document.documentElement;
      const el = ref.current;
      if (!el || !root.classList.contains("intro")) return;

      const finish = () => {
        try {
          sessionStorage.setItem("jsf-intro", "1");
        } catch {
          /* private mode: show again next time */
        }
        el.style.display = "none";
        window.dispatchEvent(new Event("jsf:intro-done"));
        window.setTimeout(() => root.classList.remove("intro"), 2200);
      };

      gsap
        .timeline({ onComplete: finish })
        .fromTo(".il-char", { y: 0, yPercent: 110 }, { yPercent: 0, duration: 0.7, ease: "expo.out", stagger: 0.035 })
        .fromTo(".il-sub", { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, "-=0.45")
        .fromTo(".il-line", { scaleX: 0 }, { scaleX: 1, duration: 1, ease: "power2.inOut" }, 0.1)
        .to(".il-char", { yPercent: -110, duration: 0.45, ease: "power3.in", stagger: 0.02 }, 1.15)
        .to(".il-sub, .il-line", { autoAlpha: 0, duration: 0.25 }, 1.2)
        .to(".il-bar", { yPercent: 101, duration: 0.75, ease: "power3.inOut", stagger: { each: 0.05, from: "center" } }, 1.35);
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="intro-loader pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden="true">
      {Array.from({ length: BARS }).map((_, i) => (
        <div
          key={i}
          className="il-bar h-full flex-1"
          style={{ background: `linear-gradient(180deg, #160d2d, ${i % 2 ? "#241645" : "#1d1138"})` }}
        />
      ))}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6">
        <p className="flex overflow-hidden font-display text-[clamp(2.6rem,1.4rem+7vw,8rem)] font-semibold leading-none tracking-[-0.04em] text-white">
          {WORD.split("").map((ch, i) => (
            <span key={i} className="il-char inline-block" style={{ transform: "translateY(110%)" }}>
              {ch}
            </span>
          ))}
        </p>
        <div className="il-line mt-6 h-px w-[min(18rem,60vw)] origin-left bg-linear-to-r from-sun-300 via-sun-500 to-ember-500" style={{ transform: "scaleX(0)" }} />
        <p className="il-sub mt-4 text-xs font-semibold uppercase tracking-[0.5em] text-sun-300" style={{ opacity: 0, transform: "translateY(8px)" }}>
          Foundation
        </p>
      </div>
    </div>
  );
}
