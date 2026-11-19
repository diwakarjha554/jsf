import Image from "next/image";
import { cn } from "@/lib/utils";

/** One shared badge asset keeps SVG gradients isolated from hidden logo variants. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <Image
      src="/icon.svg"
      alt=""
      width={48}
      height={48}
      loading="eager"
      unoptimized
      className={cn("h-10 w-10 shrink-0", className)}
      aria-hidden="true"
    />
  );
}

export function Logo({ light, className }: { light?: boolean; className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className={cn("font-display text-[1.3rem] font-bold tracking-tight", light ? "text-white" : "text-brand-900")}>
          Jeevansphere
        </span>
        <span className={cn("mt-1 text-[0.6rem] font-bold uppercase tracking-[0.34em]", light ? "text-sun-300" : "text-ember-600")}>
          Foundation
        </span>
      </span>
    </span>
  );
}
