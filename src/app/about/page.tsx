import type { Metadata } from "next";
import { Eye, Gem, HandHeart, Scale, Sparkles, Target, Users } from "lucide-react";
import { StatsGrid } from "@/components/sections/cards";
import { CausesExpand } from "@/components/home/causes-expand";
import { DonateBand } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { ArrowIcon, ButtonLink } from "@/components/ui/button";
import { Accent, Section, SectionHeading } from "@/components/ui/layout";
import { isPlaceholder, site } from "@/content/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Jeevansphere Foundation is a Delhi-based Section 8 non-profit for education, healthcare, social welfare, community development and India's cultural heritage. Our story, vision and values.",
  alternates: { canonical: "/about" },
};

// DRAFT: the foundation should review and personalise this copy.
const values = [
  { icon: HandHeart, title: "Compassion", text: "We treat everyone we work with as family, with respect and dignity." },
  { icon: Gem, title: "Integrity", text: "We do what we say, and we're honest about what we haven't done yet." },
  { icon: Users, title: "Inclusion", text: "Our work is open to all, regardless of religion, caste, gender or income." },
  { icon: Sparkles, title: "Community", text: "Lasting change comes from communities themselves; we work alongside them." },
  { icon: Scale, title: "Transparency", text: "Every rupee is accounted for, audited and reported." },
];

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export default function AboutPage() {
  const identity: [string, string][] = [
    ["Legal name", site.legal.legalName],
    ["Legal status", site.legal.type],
    ["Registered office", site.legal.registeredOffice],
    ["Area of operation", site.legal.areaOfOperation],
    ["Year of incorporation", site.legal.incorporatedYear],
    ["CIN", site.legal.cin],
  ];
  return (
    <>
      <PageHero
        title={
          <>
            A foundation for <Accent light>every life</Accent>
          </>
        }
        description="Jeevansphere means a world of life. We're a not-for-profit company working across India for education, health, dignity and the traditions that bind communities together."
        crumbs={[{ label: "About us" }]}
      />

      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          <div>
            <SectionHeading
              title={
                <>
                  Why we <Accent>started</Accent>
                </>
              }
            />
            <div className="text-lead mt-8 max-w-2xl space-y-5 text-muted" data-reveal>
              <p>
                Jeevansphere Foundation was incorporated in {site.legal.incorporatedYear} as a Section 8 company, India&apos;s
                legal form for not-for-profit organisations. Its founders came together from business and family life in
                Delhi with a shared belief: that every person deserves the chance to learn, to stay healthy and to live with
                dignity.
              </p>
              <p>
                We started with five areas of work, set out in our Memorandum of Association: education and skills,
                healthcare and wellness, social welfare, culture and heritage, and community development. We work directly
                in communities, and with schools, hospitals, NGOs, companies and government wherever we can do more together.
              </p>
              <p>
                We&apos;re at the beginning of our journey. As our programmes grow, we&apos;ll share what we do and what it
                costs, openly.
              </p>
            </div>
          </div>
          <StatsGrid />
        </div>
      </Section>

      <Section tone="white">
        <div className="grid gap-4 md:grid-cols-2">
          <div data-reveal className="grain relative overflow-hidden rounded-[2rem] bg-mesh-dark p-7 text-white sm:p-10 lg:p-12">
            <Eye className="h-10 w-10 text-sun-300" aria-hidden="true" />
            <h2 className="mt-8 font-display text-[clamp(1.8rem,1.4rem+1.4vw,2.8rem)] font-semibold">
              Our <Accent light>vision</Accent>
            </h2>
            <p className="text-lead mt-4 text-brand-100">
              An India where every person can learn, stay healthy, earn with dignity and celebrate their culture, whatever
              the circumstances of their birth.
            </p>
          </div>
          <div
            data-reveal
            style={delay(120)}
            className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(130deg,var(--color-sun-200),var(--color-sun-400)_50%,var(--color-ember-400))] p-7 text-brand-950 sm:p-10 lg:p-12"
          >
            <Target className="h-10 w-10" aria-hidden="true" />
            <h2 className="mt-8 font-display text-[clamp(1.8rem,1.4rem+1.4vw,2.8rem)] font-semibold">Our mission</h2>
            <p className="text-lead mt-4 text-brand-950/85">{site.mission}</p>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeading
          title={
            <>
              What <Accent>guides us</Accent>
            </>
          }
        />
        <ul className="mt-10 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-5">
          {values.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              data-reveal
              style={delay(i * 70)}
              className="group rounded-3xl border border-sand-dark bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgb(36_22_69/0.45)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-900 text-sun-300 transition group-hover:bg-sun-400 group-hover:text-brand-950">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-brand-900">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="sand">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <SectionHeading
              title={
                <>
                  Registered, regulated, <Accent>accountable</Accent>
                </>
              }
              description="As a Section 8 company, our income can be used only for our charitable objectives, and our accounts are audited every year."
            />
            <div className="mt-8 flex flex-wrap gap-3" data-reveal>
              <ButtonLink href="/transparency" variant="dark">
                Transparency <ArrowIcon />
              </ButtonLink>
              <ButtonLink href="/about/team" variant="outline">
                Meet the team
              </ButtonLink>
            </div>
          </div>
          <dl data-reveal="scale" className="divide-y divide-sand-dark overflow-hidden rounded-[1.75rem] border border-sand-dark bg-white shadow-[0_30px_60px_-45px_rgb(36_22_69/0.5)]">
            {identity.map(([k, v]) => (
              <div key={k} className="grid gap-1 px-6 py-4 sm:grid-cols-[12rem_1fr] sm:px-8">
                <dt className="text-sm font-semibold text-muted">{k}</dt>
                <dd className="font-semibold text-brand-900">{isPlaceholder(v) ? "Being updated" : v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      <Section tone="white">
        <SectionHeading
          title={
            <>
              What we <Accent>work on</Accent>
            </>
          }
          action={
            <ButtonLink href="/our-work" variant="outline">
              Explore our work <ArrowIcon />
            </ButtonLink>
          }
        />
        <div className="mt-10">
          <CausesExpand />
        </div>
      </Section>

      <DonateBand />
    </>
  );
}
