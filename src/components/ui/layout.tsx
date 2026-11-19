import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Consistent reading width and comfortable gutters across all pages. */
export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1440px] px-5 sm:px-8 lg:px-12 xl:px-16", className)}>{children}</div>;
}

type SectionTone = "cream" | "sand" | "white" | "dark";

const tones: Record<SectionTone, string> = {
  cream: "bg-cream",
  sand: "bg-sand",
  white: "bg-white",
  dark: "bg-mesh-dark text-white grain",
};

export function Section({
  className,
  children,
  tone = "cream",
  id,
  labelledBy,
}: {
  className?: string;
  children: ReactNode;
  tone?: SectionTone;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={cn("section-pad relative overflow-hidden", tones[tone], className)}
    >
      <Container className="relative">{children}</Container>
    </section>
  );
}

/** Italic serif highlight for a word or two inside a heading. */
export function Accent({ children, light }: { children: ReactNode; light?: boolean }) {
  return <span className={light ? "text-accent-light" : "text-accent"}>{children}</span>;
}

export function SectionHeading({
  title,
  description,
  align = "left",
  id,
  light,
  action,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  id?: string;
  light?: boolean;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-3xl", align === "center" && "mx-auto")} data-reveal="blur">
        <h2
          id={id}
          className={cn("text-title font-display font-semibold text-balance", light ? "text-white" : "text-brand-900")}
        >
          {title}
        </h2>
        {description && (
          <p className={cn("text-lead mt-4 max-w-2xl text-pretty", align === "center" && "mx-auto", light ? "text-brand-100/90" : "text-muted")}>
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0" data-reveal="fade">
          {action}
        </div>
      )}
    </div>
  );
}
