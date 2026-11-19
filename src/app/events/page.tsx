import type { Metadata } from "next";
import { CalendarDays } from "lucide-react";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { EventCard } from "@/components/sections/cards";
import { DonateBand } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { ArrowIcon, ButtonLink } from "@/components/ui/button";
import { Accent, Section, SectionHeading } from "@/components/ui/layout";
import { JsonLd } from "@/components/ui/misc";
import { toneStyles } from "@/components/ui/tones";
import { eventTypes, pastEvents, upcomingEvents } from "@/content/events";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Events: Ram Leela, Festivals & Health Camps in Delhi",
  description:
    "Upcoming events by Jeevansphere Foundation: Ram Leela, community festivals, spiritual gatherings, health camps and awareness workshops in Delhi.",
  alternates: { canonical: "/events" },
};

export default function EventsPage() {
  const eventsLd = upcomingEvents.map((e) => ({
    "@context": "https://schema.org",
    "@type": "Event",
    name: e.title,
    startDate: e.date,
    endDate: e.endDate ?? e.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: { "@type": "Place", name: e.venue, address: e.venue },
    description: e.description,
    organizer: { "@type": "Organization", name: site.name, url: site.url },
  }));

  return (
    <>
      <PageHero
        title={
          <>
            Celebrations, camps <Accent light>and gatherings</Accent>
          </>
        }
        description="Our events bring neighbourhoods together, from Ram Leela and festivals to free health camps and workshops. Everyone is welcome."
        crumbs={[{ label: "Events" }]}
      />

      <Section>
        <SectionHeading
          title={
            <>
              Upcoming <Accent>events</Accent>
            </>
          }
        />
        {upcomingEvents.length ? (
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {upcomingEvents.map((e, i) => (
              <EventCard key={e.slug} event={e} index={i} />
            ))}
          </div>
        ) : (
          <div
            data-reveal="scale"
            className="grain relative mt-10 grid items-center gap-8 overflow-hidden rounded-[2rem] bg-mesh-dark p-7 text-white sm:p-10 md:grid-cols-[auto_1fr] lg:p-14"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-3xl bg-sun-400 text-brand-950 shadow-xl shadow-sun-500/30">
              <CalendarDays className="h-10 w-10" aria-hidden="true" />
            </span>
            <div>
              <h3 className="font-display text-[clamp(1.6rem,1.3rem+1vw,2.4rem)] font-semibold">Dates coming soon</h3>
              <p className="mt-2 max-w-2xl leading-relaxed text-brand-100">
                We&apos;re planning our first programmes. Subscribe to our monthly update and we&apos;ll tell you as soon as
                dates are fixed.
              </p>
              <NewsletterForm source="events" variant="dark" className="mt-6 max-w-md" />
            </div>
          </div>
        )}
      </Section>

      <Section tone="white">
        <SectionHeading
          title={
            <>
              Events we hold <Accent>through the year</Accent>
            </>
          }
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {eventTypes.map(({ title, text, icon: Icon, tone }, i) => (
            <article
              key={title}
              data-reveal
              style={{ "--d": `${i * 80}ms` } as React.CSSProperties}
              className="group rounded-3xl border border-sand-dark bg-cream p-6 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_50px_-30px_rgb(36_22_69/0.45)] sm:p-7"
            >
              <span className={cn("flex h-14 w-14 items-center justify-center rounded-2xl transition duration-300 group-hover:rotate-[-6deg] group-hover:scale-110", toneStyles[tone].chip)}>
                <Icon className="h-7 w-7" aria-hidden="true" />
              </span>
              <h3 className="mt-6 font-display text-xl font-semibold text-brand-900">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{text}</p>
            </article>
          ))}
        </div>
      </Section>

      {pastEvents.length > 0 && (
        <Section>
          <SectionHeading
            title={
              <>
                Looking <Accent>back</Accent>
              </>
            }
          />
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {pastEvents.map((e, i) => (
              <EventCard key={e.slug} event={e} index={i} />
            ))}
          </div>
        </Section>
      )}

      <Section tone="sand">
        <SectionHeading
          title={
            <>
              Help us run <Accent>our events</Accent>
            </>
          }
          description="Volunteers make every event possible, from setting up to serving prasad."
          action={
            <ButtonLink href="/get-involved/volunteer" size="lg">
              Volunteer at events <ArrowIcon />
            </ButtonLink>
          }
        />
      </Section>
      <DonateBand
        cause="culture-heritage"
        title={
          <>
            Keep our <Accent>traditions alive</Accent>
          </>
        }
      />
      {eventsLd.map((ld, i) => (
        <JsonLd key={i} data={ld} />
      ))}
    </>
  );
}
