import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "dark" | "outline" | "ghost" | "light" | "glass";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn inline-flex items-center justify-center gap-2 rounded-xl text-center font-semibold leading-tight transition duration-200 focus-visible:outline-none focus-visible:ring-4 disabled:pointer-events-none disabled:opacity-60 [&_svg]:shrink-0";

const variants: Record<Variant, string> = {
  primary:
    "btn-shine bg-[linear-gradient(110deg,var(--color-sun-300),var(--color-sun-500)_55%,var(--color-ember-400))] text-brand-950 shadow-[0_12px_32px_-12px_rgb(230_143_0/0.75)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-14px_rgb(230_143_0/0.85)] focus-visible:ring-sun-300/60",
  dark: "bg-brand-900 text-white shadow-[0_12px_30px_-14px_rgb(22_13_45/0.7)] hover:-translate-y-0.5 hover:bg-brand-800 focus-visible:ring-brand-300/60",
  outline:
    "border border-brand-900/15 bg-white/70 text-brand-900 backdrop-blur hover:border-brand-900/35 hover:bg-white focus-visible:ring-brand-200",
  ghost: "text-brand-800 hover:bg-brand-50 focus-visible:ring-brand-200",
  light: "bg-white text-brand-950 shadow-lg shadow-black/10 hover:-translate-y-0.5 hover:bg-sun-50 focus-visible:ring-white/50",
  glass: "border border-white/25 bg-white/10 text-white backdrop-blur hover:bg-white/20 focus-visible:ring-white/40",
};

const sizes: Record<Size, string> = {
  sm: "min-h-10 px-4 py-2 text-sm",
  md: "min-h-12 px-6 py-3 text-[15px]",
  lg: "min-h-14 px-7 py-3.5 text-base",
};

export function buttonClass(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type LinkProps = ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function ButtonLink({ variant, size, className, ...props }: LinkProps) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

type BtnProps = ComponentProps<"button"> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, type = "button", ...props }: BtnProps) {
  return <button type={type} className={buttonClass(variant, size, className)} {...props} />;
}

/** Arrow that nudges right when its button or card is hovered. */
export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-1 group-hover:translate-x-1", className)}
    >
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}
