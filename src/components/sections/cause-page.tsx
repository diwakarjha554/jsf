import type { Metadata } from "next";
import { Check, Heart } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { causes, getCause, type CauseSlug } from "@/content/causes";
import { site } from "@/content/site";
import { cn, formatINR } from "@/lib/utils";
import { Artwork } from "../ui/artwork";
import { ArrowIcon, ButtonLink } from "../ui/button";
import { Accent, Container, Section, SectionHeading } from "../ui/layout";
import { toneStyles } from "../ui/tones";
import { CauseCardCompact } from "./causes";
import { DonateBand } from "./cta";
import { PageHero } from "./page-hero";

export function causeMetadata(slug: CauseSlug): Metadata {
  const cause = getCause(slug)!;
  return {
    title: cause.metaTitle,
    description: cause.metaDescription,
    alternates: { canonical: `/our-work/${slug}` },
    openGraph: { title: `${cause.title} | ${site.name}`, description: cause.metaDescription },
  };
}

export function CausePage({ slug }: { slug: CauseSlug }) {
  const cause = getCause(slug);
  if (!cause) notFound();
  const t = toneStyles[cause.tone];
  const Icon = cause.icon;
  const others = causes.filter((c) => c.slug !== slug);
  const [firstWord, ...rest] = cause.title.split(" ");

  return (
    <>
      <PageHero
        title={
          <>
            {firstWord} <Accent light>{rest.join(" ")}</Accent>
          </>
        }
        description={cause.summary}
        crumbs={[{ label: "Our work", href: "/our-work" }, { label: cause.title }]}
        aside={
          <Artwork tone={cause.tone} icon={Icon} iconPosition="center" className="aspect-[4/3] w-full shadow-2xl shadow-black/30" label={`${cause.title} illustration`} variant={1} />
        }
      >
        <ButtonLink href={`/donate?cause=${cause.slug}`} size="lg">
          <Heart className="h-5 w-5" fill="currentColor" aria-hidden="true" />
          Donate to {cause.shortTitle.toLowerCase()}
        </ButtonLink>
        <ButtonLink href="/get-involved/volunteer" variant="glass" size="lg">
          Volunteer
        </ButtonLink>
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <SectionHeading
              title={
                <>
                  Why this <Accent>matters</Accent>
                </>
              }
            />
            <p className="text-lead mt-6 text-muted" data-reveal>
              {cause.need}
            </p>
            <p className="mt-5 text-sm text-muted" data-reveal>
              Part of the foundation&apos;s registered objectives ({cause.moa}).
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {cause.whatWeDo.map((item, i) => (
              <li
                key={item}
                data-reveal
                style={{ "--d": `${i * 60}ms` } as React.CSSProperties}
                className="group flex gap-4 rounded-2xl border border-sand-dark bg-white p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-28px_rgb(36_22_69/0.45)]"
              >
                <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition group-hover:scale-110", t.chip)}>
                  <Check className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="leading-relaxed text-ink">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="dark">
        <SectionHeading
          light
          title={
            <>
              What we&apos;re <Accent light>starting with</Accent>
            </>
          }
          description="Our first programmes in this area. Each one launches as funding and volunteers come together."
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {cause.programmes.map((p, i) => (
            <article
              key={p.title}
              data-spotlight
              data-reveal
              style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08] sm:p-7"
            >
              <h3 className="font-display text-xl font-semibold text-white">{p.title}</h3>
              <p className="mt-2 leading-relaxed text-brand-200">{p.text}</p>
              <p className="mt-5 flex items-center gap-2 text-sm font-medium text-sun-300">
                <span className="h-2 w-2 animate-pulse rounded-full bg-sun-400" aria-hidden="true" /> Launching soon
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section tone="sand">
        <SectionHeading
          title={
            <>
              What your gift <Accent>can do</Accent>
            </>
          }
          description="Choose an amount and your gift goes directly to this cause."
        />
        <ul className="mt-10 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-5">
          {Object.entries(cause.impact).map(([amount, text], i) => (
            <li key={amount} data-reveal style={{ "--d": `${i * 60}ms` } as React.CSSProperties}>
              <Link
                href={`/donate?cause=${cause.slug}&amount=${amount}`}
                className="group flex h-full flex-col rounded-3xl border border-sand-dark bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-sun-400 hover:shadow-[0_24px_50px_-30px_rgb(230_143_0/0.7)] sm:p-6"
              >
                <span className="font-display text-[clamp(1.6rem,1.3rem+0.8vw,2.1rem)] font-semibold text-brand-900">{formatINR(Number(amount))}</span>
                <span className="mt-2 flex-1 text-[15px] leading-relaxed text-muted">{text}</span>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-ember-600">
                  Give {formatINR(Number(amount))} <ArrowIcon />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <DonateBand
        title={
          <>
            Support {cause.shortTitle.toLowerCase()} <Accent>today</Accent>
          </>
        }
        cause={cause.slug}
      />

      <section className="bg-cream pb-[clamp(4rem,3rem+3vw,7rem)]">
        <Container>
          <h2 className="font-display text-[clamp(1.5rem,1.2rem+1vw,2.2rem)] font-semibold text-brand-900" data-reveal>
            Explore our other work
          </h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {others.map((c, i) => (
              <CauseCardCompact key={c.slug} cause={c} index={i} />
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
