import type { Metadata } from "next";
import Image from "next/image";
import { DonateBand } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { ArrowIcon, ButtonLink } from "@/components/ui/button";
import { Accent, Section, SectionHeading } from "@/components/ui/layout";
import { Initials } from "@/components/ui/misc";
import { advisors, board, type TeamMember } from "@/content/team";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the founding members and team behind Jeevansphere Foundation, a Delhi-based non-profit.",
  alternates: { canonical: "/about/team" },
};

function MemberCard({ m, index }: { m: TeamMember; index: number }) {
  const bio = m.bio.includes("[TBD]") ? "" : m.bio;
  return (
    <li
      data-reveal
      style={{ "--d": `${index * 80}ms` } as React.CSSProperties}
      className="group overflow-hidden rounded-[1.75rem] border border-sand-dark bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-36px_rgb(36_22_69/0.5)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {m.photo ? (
          <Image src={m.photo} alt="" fill sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" className="object-cover transition duration-700 group-hover:scale-105" />
        ) : (
          <Initials name={m.name} className="h-full w-full text-[clamp(2.5rem,2rem+2vw,4rem)] transition duration-700 group-hover:scale-105" />
        )}
      </div>
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold text-brand-900">{m.name}</h3>
        <p className="mt-1 text-sm font-semibold text-ember-600">{m.role}</p>
        {bio && <p className="mt-3 leading-relaxed text-muted">{bio}</p>}
      </div>
    </li>
  );
}

export default function TeamPage() {
  return (
    <>
      <PageHero
        title={
          <>
            The people behind <Accent light>Jeevansphere</Accent>
          </>
        }
        description="A small team of founders and volunteers, growing with every programme."
        crumbs={[{ label: "About us", href: "/about" }, { label: "Our team" }]}
      />
      <Section>
        <SectionHeading
          title={
            <>
              Our founding <Accent>members</Accent>
            </>
          }
        />
        <ul className="mt-10 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
          {board.map((m, i) => (
            <MemberCard key={m.name} m={m} index={i} />
          ))}
        </ul>
      </Section>
      {advisors.length > 0 && (
        <Section tone="white">
          <SectionHeading
            title={
              <>
                Guided by <Accent>experience</Accent>
              </>
            }
          />
          <ul className="mt-10 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 lg:grid-cols-4">
            {advisors.map((m, i) => (
              <MemberCard key={m.name} m={m} index={i} />
            ))}
          </ul>
        </Section>
      )}
      <Section tone="sand">
        <SectionHeading
          title={
            <>
              Want to <Accent>work with us?</Accent>
            </>
          }
          description="We're always looking for volunteers, interns and professionals who share our values."
          action={
            <ButtonLink href="/get-involved/volunteer" size="lg">
              Join as a volunteer <ArrowIcon />
            </ButtonLink>
          }
        />
      </Section>
      <DonateBand />
    </>
  );
}
