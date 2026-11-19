"use client";

/**
 * Smooth scrolling (Lenis), adapted from Vengeance UI "smooth-scroll".
 * Vengeance UI — https://www.vengenceui.com — MIT License, Copyright (c) 2025-2026 Ashutoshx7.
 * Changes: GSAP ticker/ScrollTrigger sync, anchor links, reduced-motion opt-out.
 */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useEffect } from "react";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.13, wheelMultiplier: 1, smoothWheel: true, anchors: { offset: -96 } });
    window.__lenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      delete window.__lenis;
    };
  }, []);

  return null;
}
