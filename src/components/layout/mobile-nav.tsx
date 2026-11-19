"use client";

import { ChevronDown, Heart, Mail, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { mainNav } from "@/content/navigation";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";
import { buttonClass } from "../ui/button";
import { Logo } from "../ui/logo";

const noSubscribe = () => () => {};

export function MobileNav() {
  // The header uses backdrop-filter, which would trap a fixed overlay inside it, so the menu is portalled to <body>.
  const mounted = useSyncExternalStore(noSubscribe, () => true, () => false);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const trigger = triggerRef.current;
    const focusFrame = requestAnimationFrame(() => {
      menuRef.current?.querySelector<HTMLButtonElement>('button[aria-label="Close menu"]')?.focus();
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab") return;
      const focusable = Array.from(menuRef.current?.querySelectorAll<HTMLElement>('a[href]:not([tabindex="-1"]), button:not([disabled])') ?? [])
        .filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      trigger?.focus();
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className="lg:hidden">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="group flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-xl text-current transition hover:bg-black/5 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sun-300/60"
        aria-label="Open menu"
        aria-expanded={open}
        aria-controls="mobile-menu"
      >
        <span className="h-0.5 w-6 rounded-full bg-current" />
        <span className="h-0.5 w-4 self-end rounded-full bg-current transition-all group-hover:w-6 mr-2.5" />
        <span className="h-0.5 w-6 rounded-full bg-current" />
      </button>

      {mounted && open &&
        createPortal(
      <div
        ref={menuRef}
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="grain fixed inset-0 z-50 flex flex-col bg-mesh-dark text-white"
      >
        <div className="flex h-[4.25rem] shrink-0 items-center justify-between px-4 sm:px-6">
          <Link href="/" onClick={close} aria-label={`${site.name}, home`}>
            <Logo light />
          </Link>
          <button
            type="button"
            onClick={close}
            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-6">
          <ul>
            {mainNav.map((item, i) => (
              <li
                key={item.label}
                className={cn(
                  "border-b border-white/10 transition duration-500",
                  open ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0",
                )}
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms" }}
              >
                {item.children ? (
                  <>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-4 text-left font-display text-[clamp(1.4rem,5vw,2rem)] font-semibold"
                      aria-expanded={expanded === item.label}
                      onClick={() => setExpanded(expanded === item.label ? null : item.label)}
                    >
                      {item.label}
                      <ChevronDown
                        className={cn("h-6 w-6 text-sun-400 transition-transform duration-300", expanded === item.label && "rotate-180")}
                        aria-hidden="true"
                      />
                    </button>
                    <div
                      className={cn(
                        "grid transition-[grid-template-rows] duration-300",
                        expanded === item.label ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      )}
                    >
                      <ul className="overflow-hidden">
                        {item.children.map((child) => {
                          const Icon = child.icon;
                          return (
                            <li key={child.href + child.label}>
                              <Link
                                href={child.href}
                                onClick={close}
                                tabIndex={expanded === item.label ? undefined : -1}
                                className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-brand-100 transition hover:bg-white/10 hover:text-white"
                              >
                                {Icon && (
                                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sun-300">
                                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                                  </span>
                                )}
                                {child.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={close}
                    className="block py-4 font-display text-[clamp(1.4rem,5vw,2rem)] font-semibold"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 space-y-3 border-t border-white/10 p-4 sm:p-6">
          <Link href="/donate" onClick={close} className={buttonClass("primary", "lg", "w-full")}>
            <Heart className="h-5 w-5" fill="currentColor" aria-hidden="true" />
            Donate now
          </Link>
          <a href={`mailto:${site.contact.email}`} className="flex items-center justify-center gap-2 text-sm text-brand-200">
            <Mail className="h-4 w-4" aria-hidden="true" />
            {site.contact.email}
          </a>
        </div>
      </div>,
          document.body,
        )}
    </div>
  );
}
