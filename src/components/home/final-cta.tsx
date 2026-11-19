import { Heart } from "lucide-react";
import Link from "next/link";
import { ArrowIcon, buttonClass } from "../ui/button";
import { Container } from "../ui/layout";
import { Magnetic } from "../ui/magnetic";

/** Closing call to action over drifting aurora light (Vengeance UI Animated Rays technique). */
export function FinalCta() {
  return (
    <section data-surface="dark" className="grain relative isolate overflow-hidden bg-brand-950 py-[clamp(4rem,3rem+4vw,8rem)] text-white">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="bg-aurora absolute -inset-x-1/4 top-0 h-full opacity-50 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_100%,black_15%,transparent_70%)]" />
        <div className="absolute left-1/2 top-full h-[60rem] w-[60rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(255_174_10/0.35),rgb(245_83_46/0.15)_50%,transparent)]" />
      </div>
      <Container className="relative text-center">
        <h2 className="mx-auto max-w-[18ch] font-display text-[clamp(2.6rem,1.4rem+4.6vw,6.5rem)] font-semibold leading-[1.08] tracking-[-0.04em]">
          Be the reason someone <span className="block pb-2 font-serif font-normal italic tracking-[-0.02em] text-sun-300">gets a fair start.</span>
        </h2>
        <p className="text-lead mx-auto mt-6 max-w-xl text-brand-100/80" data-reveal>
          Every rupee reaches the work. Give by UPI in under a minute, and get a receipt for every gift.
        </p>
        <div className="mt-9 flex flex-col items-center justify-center gap-4 min-[440px]:flex-row" data-reveal>
          <Magnetic strength={0.4}>
            <Link href="/donate" className={buttonClass("primary", "lg", "min-h-16 px-10 text-lg")}>
              <Heart className="h-5 w-5" fill="currentColor" aria-hidden="true" />
              Donate now
            </Link>
          </Magnetic>
          <Magnetic>
            <Link href="/get-involved/volunteer" className={buttonClass("glass", "lg", "min-h-16 px-8")}>
              Volunteer with us <ArrowIcon />
            </Link>
          </Magnetic>
        </div>
      </Container>
    </section>
  );
}
