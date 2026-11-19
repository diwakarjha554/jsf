import { BookOpen, Heart, ShieldCheck, Sprout, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ArrowIcon, buttonClass } from "../ui/button";
import { Container } from "../ui/layout";

/** The message and artwork render with the page, without an animation dependency. */
export function HomeHero() {
  return (
    <section
      id="home-hero"
      data-surface="dark"
      aria-labelledby="hero-title"
      className="relative isolate -mt-[4.25rem] overflow-hidden bg-brand-950 pt-[4.25rem] text-white lg:-mt-[4.75rem] lg:pt-[4.75rem]"
    >
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_80%_40%,rgb(91_61_163/0.3),transparent_65%)]" aria-hidden="true" />
      <Container className="grid items-center gap-10 pb-16 pt-10 sm:gap-12 sm:pb-20 sm:pt-14 lg:min-h-[41rem] lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:pb-20 lg:pt-12">
        <div className="min-w-0">
          <h1 id="hero-title" className="font-display text-[clamp(2.9rem,1.4rem+4.3vw,5.8rem)] font-semibold leading-[1.04] tracking-[-0.045em]">
            <span className="block">Every life</span>
            <span className="block">deserves a</span>
            <span className="block pb-2 font-serif font-normal italic tracking-[-0.02em] text-sun-200">fair start.</span>
          </h1>
          <p className="mt-5 max-w-[33rem] text-base leading-relaxed text-brand-100 sm:text-lg sm:leading-relaxed">
            A chance to learn. Access to care. A community to belong to.
            We work with communities across India to help make these everyday possibilities.
          </p>
          <div className="mt-8 flex flex-col gap-3 min-[440px]:flex-row">
            <Link href="/donate" className={buttonClass("primary", "lg")}>
              <Heart className="h-5 w-5" fill="currentColor" aria-hidden="true" />
              Donate by UPI
            </Link>
            <Link href="/get-involved/volunteer" className={buttonClass("glass", "lg")}>
              Volunteer with us <ArrowIcon />
            </Link>
          </div>
          <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-brand-200 sm:text-sm">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-sun-300" aria-hidden="true" />
            Section 8 non-profit · New Delhi · Working for India
          </p>
        </div>
        <figure className="relative mx-auto w-full max-w-[35rem] lg:ml-auto lg:max-w-[30rem]">
          <div className="absolute -inset-3 rotate-3 rounded-[2.5rem] border border-sun-200/20 sm:-inset-4 sm:rounded-[3rem]" aria-hidden="true" />
          <div className="relative overflow-hidden rounded-[2rem] bg-cream sm:rounded-[2.5rem]">
            <Image
              src="/images/community-care.webp"
              alt="Illustration of children learning with a teacher and a neighbour tending a sapling under a tree."
              width={1024}
              height={1024}
              sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 560px, (max-width: 1199px) 44vw, 480px"
              loading="eager"
              fetchPriority="high"
              className="aspect-square w-full object-cover"
            />
            <figcaption className="flex items-center gap-3 border-t border-sand-dark bg-cream px-5 py-4 text-brand-900 sm:px-7 sm:py-5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sun-200">
                <Sprout className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-sm leading-relaxed">
                <span className="block font-semibold">Small acts of care. Lasting possibilities.</span>
                <span className="text-muted">A fairer future begins with all of us.</span>
              </span>
            </figcaption>
          </div>
        </figure>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-wrap items-center justify-center gap-x-7 gap-y-3 py-5 text-sm text-brand-100 sm:gap-x-14 lg:justify-start">
          <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-sun-300" aria-hidden="true" /> Education &amp; opportunity</span>
          <span className="flex items-center gap-2"><Heart className="h-4 w-4 text-sun-300" aria-hidden="true" /> Health &amp; dignity</span>
          <span className="flex items-center gap-2"><Users className="h-4 w-4 text-sun-300" aria-hidden="true" /> Stronger communities</span>
        </Container>
      </div>
    </section>
  );
}
