import type { Metadata } from "next";
import { BookOpen, Handshake, Megaphone, Users } from "lucide-react";
import { CausesExpand } from "@/components/home/causes-expand";
import { DonateBand } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { Accent, Section, SectionHeading } from "@/components/ui/layout";

export const metadata: Metadata = {
  title: "Our Work: Education, Healthcare, Social Welfare & Culture",
  description:
    "Jeevansphere Foundation works on education and skills, healthcare, social welfare, culture and heritage, and community development across India.",
  alternates: { canonical: "/our-work" },
};

const approach = [
  { icon: Users, title: "Direct programmes", text: "We run programmes in communities ourselves: classes, camps, kits and celebrations." },
  { icon: Handshake, title: "Partnerships", text: "We work with schools, hospitals, NGOs, companies and government to reach further." },
  { icon: Megaphone, title: "Awareness", text: "Workshops, seminars and campaigns on health, education and rights." },
  { icon: BookOpen, title: "Research & resources", text: "We study what works and share what we learn as a resource centre." },
];

export default function OurWorkPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Five areas, one goal: <Accent light>a better life</Accent>
          </>
        }
        description="Our focus areas come straight from the objectives in our registered Memorandum of Association."
        crumbs={[{ label: "Our work" }]}
      />
      <Section>
        <CausesExpand />
      </Section>
      <Section tone="dark">
        <SectionHeading
          light
          title={
            <>
              How we <Accent light>work</Accent>
            </>
          }
          description="Four ways of working that run through every focus area."
        />
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {approach.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              data-spotlight
              data-reveal
              style={{ "--d": `${i * 80}ms` } as React.CSSProperties}
              className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/[0.08] sm:p-7"
            >
              <span className="font-display text-sm font-semibold text-sun-300">0{i + 1}</span>
              <Icon className="mt-6 h-9 w-9 text-white" strokeWidth={1.6} aria-hidden="true" />
              <h3 className="mt-5 font-display text-xl font-semibold text-white">{title}</h3>
              <p className="mt-2 leading-relaxed text-brand-200">{text}</p>
            </li>
          ))}
        </ul>
      </Section>
      <DonateBand />
    </>
  );
}
