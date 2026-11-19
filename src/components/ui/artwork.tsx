import type { LucideIcon } from "lucide-react";
import type { Tone } from "@/content/causes";
import { cn } from "@/lib/utils";
import { toneStyles } from "./tones";

type Props = {
  tone?: Tone;
  icon?: LucideIcon;
  className?: string;
  /** Accessible description. Omit for purely decorative art. */
  label?: string;
  variant?: 1 | 2 | 3;
  iconPosition?: "corner" | "center";
  /** Fill the nearest positioned parent (absolute inset-0) instead of sizing itself. */
  fill?: boolean;
};

/**
 * Mesh-gradient illustration used where photos will go later (rings echo the logo's "sphere").
 * Swap for next/image photos as the foundation supplies them.
 */
export function Artwork({ tone = "brand", icon: Icon, className, label, variant = 1, iconPosition = "corner", fill }: Props) {
  const t = toneStyles[tone];
  const ringAt = variant === 1 ? "85% 15%" : variant === 2 ? "15% 20%" : "50% 110%";
  return (
    <div
      className={cn(
        "grain isolate overflow-hidden bg-linear-to-br text-white",
        fill ? "absolute inset-0" : "relative rounded-3xl",
        t.panel,
        className,
      )}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(60% 55% at ${variant === 2 ? "80% 85%" : "15% 85%"}, rgb(255 255 255 / 0.22), transparent 70%), radial-gradient(45% 40% at ${variant === 3 ? "85% 15%" : "70% 20%"}, rgb(255 209 92 / 0.28), transparent 70%)`,
        }}
      />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage: `repeating-radial-gradient(circle at ${ringAt}, transparent 0 46px, rgb(255 255 255 / 0.16) 46px 47.5px)`,
        }}
      />
      {Icon && (
        <div
          className={cn(
            "absolute flex items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/35 backdrop-blur-md",
            iconPosition === "center"
              ? "left-1/2 top-1/2 h-[28%] max-h-28 w-auto aspect-square -translate-x-1/2 -translate-y-1/2"
              : "bottom-4 left-4 h-14 w-14 sm:bottom-5 sm:left-5 sm:h-16 sm:w-16",
          )}
        >
          <Icon className={iconPosition === "center" ? "h-1/2 w-1/2" : "h-7 w-7 sm:h-8 sm:w-8"} strokeWidth={1.6} aria-hidden="true" />
        </div>
      )}
    </div>
  );
}
