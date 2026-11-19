import Link from "next/link";
import { CausesExpand } from "@/components/home/causes-expand";
import { FinalCta } from "@/components/home/final-cta";
import { GivingStack } from "@/components/home/giving-stack";
import { HomeHero } from "@/components/home/hero";
import { EventsReveal, InvolveRows, SectionTitle, TrustGlow } from "@/components/home/home-sections";
import { ImpactExplorer } from "@/components/home/impact-explorer";
import { Manifesto } from "@/components/home/manifesto";
import { StoryCard } from "@/components/sections/cards";
import { ArrowIcon, buttonClass } from "@/components/ui/button";
import { Accent, Container } from "@/components/ui/layout";
import { upcomingEvents } from "@/content/events";
import { stories } from "@/content/stories";

const pad = "section-pad";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <Manifesto />

      {/* ── Causes: expanding panels ─────────────────────────────── */}
      <section data-surface="dark" className={`grain relative overflow-hidden bg-mesh-dark text-white ${pad}`} aria-labelledby="work-title">
        <Container className="relative">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div id="work-title">
              <SectionTitle light>
                Five ways we make <Accent light>a difference</Accent>
              </SectionTitle>
            </div>
            <div className="max-w-sm" data-reveal>
              <p className="text-lead text-brand-100/80">
                Every programme comes straight from the objectives in our registered Memorandum of Association.
              </p>
              <Link href="/our-work" className={buttonClass("glass", "md", "mt-6")}>
                All our work <ArrowIcon />
              </Link>
            </div>
          </div>
          <div className="mt-10" data-reveal>
            <CausesExpand />
          </div>
        </Container>
      </section>

      <section data-surface="light" className="border-b border-sand-dark bg-cream py-12 sm:py-16" aria-label="No gateway fees">
        <Container className="grid items-center gap-6 sm:grid-cols-[auto_1fr] sm:gap-12 lg:gap-20">
          <p className="font-display text-[clamp(4rem,9vw,8rem)] font-semibold leading-none tracking-[-0.05em] text-brand-900">₹0<span className="mt-3 block text-xs font-semibold uppercase tracking-[0.16em] text-ember-700 sm:text-sm">Gateway fees</span></p>
          <div className="max-w-2xl">
            <h2 className="font-display text-title font-semibold text-brand-900">More of your kindness <Accent>reaches the work.</Accent></h2>
            <p className="text-lead mt-4 text-muted">Give from your own UPI app, straight into our bank account. No payment gateway deductions.</p>
          </div>
        </Container>
      </section>

      {/* ── Impact explorer ──────────────────────────────────────── */}
      <section data-surface="light" className={`bg-sand ${pad}`} aria-labelledby="gift-title">
        <Container>
          <div id="gift-title" className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionTitle>
              See what your gift <Accent>can do</Accent>
            </SectionTitle>
            <p className="text-lead max-w-sm text-muted" data-reveal>
              Pick a cause and an amount. You&apos;ll see exactly where your money goes.
            </p>
          </div>
          <div className="mt-10" data-reveal>
            <ImpactExplorer />
          </div>
        </Container>
      </section>

      {/* ── How giving works: stacking cards ─────────────────────── */}
      <section data-surface="light" className={`bg-cream ${pad}`} aria-labelledby="how-title">
        <Container>
          <div id="how-title" className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionTitle>
              Give in three <Accent>easy steps</Accent>
            </SectionTitle>
            <p className="text-lead max-w-sm text-muted" data-reveal>
              No card details, no gateway fees, and a receipt for every rupee.
            </p>
          </div>
          <div className="mt-10">
            <GivingStack />
          </div>
        </Container>
      </section>

      {/* ── Trust ────────────────────────────────────────────────── */}
      <section data-surface="dark" className={`grain relative overflow-hidden bg-mesh-dark text-white ${pad}`} aria-labelledby="trust-title">
        <Container className="relative">
          <div id="trust-title" className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionTitle light>
              Trust is earned. <Accent light>Here&apos;s how we earn it.</Accent>
            </SectionTitle>
            <Link href="/transparency" className={buttonClass("glass", "md")} data-reveal>
              Registrations &amp; documents <ArrowIcon />
            </Link>
          </div>
          <div className="mt-10">
            <TrustGlow />
          </div>
        </Container>
      </section>

      {/* ── Events: editorial reveal list ────────────────────────── */}
      <section data-surface="light" className={`bg-cream ${pad}`} aria-labelledby="events-title">
        <Container>
          <div id="events-title" className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionTitle>
              {upcomingEvents.length ? (
                <>
                  Join us at our <Accent>next events</Accent>
                </>
              ) : (
                <>
                  Celebrations and camps <Accent>for everyone</Accent>
                </>
              )}
            </SectionTitle>
            <Link href="/events" className={buttonClass("outline", "md")} data-reveal>
              All events <ArrowIcon />
            </Link>
          </div>
          <div className="mt-8" data-reveal>
            <EventsReveal />
          </div>
        </Container>
      </section>

      {/* ── Get involved: giant rows ─────────────────────────────── */}
      <section data-surface="light" className={`bg-white ${pad}`} aria-labelledby="involved-title">
        <Container>
          <div id="involved-title">
            <SectionTitle>
              There&apos;s a place <Accent>for you here</Accent>
            </SectionTitle>
          </div>
          <div className="mt-8" data-reveal>
            <InvolveRows />
          </div>
        </Container>
      </section>

      {/* ── Stories ──────────────────────────────────────────────── */}
      {stories.length > 0 && (
        <section data-surface="light" className={`bg-cream ${pad}`} aria-labelledby="stories-title">
          <Container>
            <div id="stories-title" className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <SectionTitle>
                News from <Accent>Jeevansphere</Accent>
              </SectionTitle>
              <Link href="/stories" className={buttonClass("outline", "md")} data-reveal>
                All stories <ArrowIcon />
              </Link>
            </div>
            <div className="mt-10">
              <StoryCard story={stories[0]} featured />
            </div>
          </Container>
        </section>
      )}

      <FinalCta />
    </>
  );
}
