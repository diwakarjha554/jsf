import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "../ui/layout";

type Crumb = { label: string; href?: string };

/** Inner-page hero: a rounded dark panel with drifting colour glows and "sphere" rings. */
export function PageHero({
  title,
  description,
  crumbs = [],
  children,
  aside,
}: {
  title: ReactNode;
  description?: ReactNode;
  crumbs?: Crumb[];
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="px-2 pt-2 sm:px-3 sm:pt-3">
      <div className="grain relative isolate overflow-hidden rounded-[1.75rem] bg-mesh-dark text-white sm:rounded-[2.5rem]">
        <div className="bg-aurora absolute -inset-x-1/4 -top-1/3 -z-10 h-[90%] opacity-35 [mask-image:radial-gradient(ellipse_60%_60%_at_80%_20%,black_10%,transparent_70%)]" aria-hidden="true" />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(34rem_26rem_at_90%_0%,rgb(115_83_191/0.55),transparent_70%),radial-gradient(26rem_20rem_at_15%_110%,rgb(245_83_46/0.25),transparent_70%)]" aria-hidden="true" />
        <div
          className="absolute -right-40 top-1/2 -z-10 aspect-square w-[44rem] -translate-y-1/2 opacity-40 sm:-right-24"
          style={{ backgroundImage: "repeating-radial-gradient(circle, transparent 0 54px, rgb(187 168 230 / 0.35) 54px 55.5px)" }}
          aria-hidden="true"
        />
        <Container className="relative py-[clamp(2.75rem,2rem+3.5vw,5.5rem)]">
          {crumbs.length > 0 && (
            <nav aria-label="Breadcrumb" className="anim-fade mb-6">
              <ol className="flex flex-wrap items-center gap-1.5 text-sm text-brand-200">
                <li>
                  <Link href="/" className="transition hover:text-white">
                    Home
                  </Link>
                </li>
                {crumbs.map((c) => (
                  <li key={c.label} className="flex items-center gap-1.5">
                    <ChevronRight className="h-3.5 w-3.5 text-brand-400" aria-hidden="true" />
                    {c.href ? (
                      <Link href={c.href} className="transition hover:text-white">
                        {c.label}
                      </Link>
                    ) : (
                      <span aria-current="page" className="text-white">
                        {c.label}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          )}
          <div className={aside ? "grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]" : undefined}>
            <div className="max-w-4xl">
              <h1 className="text-display anim-fade font-display font-semibold text-balance" style={{ "--d": "0.08s" } as React.CSSProperties}>
                {title}
              </h1>
              {description && (
                <p className="text-lead anim-fade mt-5 max-w-2xl text-brand-100/90 text-pretty" style={{ "--d": "0.2s" } as React.CSSProperties}>
                  {description}
                </p>
              )}
              {children && (
                <div className="anim-fade mt-8 flex flex-wrap gap-3" style={{ "--d": "0.32s" } as React.CSSProperties}>
                  {children}
                </div>
              )}
            </div>
            {aside && (
              <div className="anim-scale" style={{ "--d": "0.25s" } as React.CSSProperties}>
                {aside}
              </div>
            )}
          </div>
        </Container>
      </div>
    </section>
  );
}
