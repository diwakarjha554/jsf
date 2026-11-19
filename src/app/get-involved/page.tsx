import type { Metadata } from "next";
import { Gift, GraduationCap, HandHeart, Handshake, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { DonateBand } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { Artwork } from "@/components/ui/artwork";
import { ArrowIcon } from "@/components/ui/button";
import { Accent, Section } from "@/components/ui/layout";

export const metadata: Metadata = {
  title: "Get Involved: Donate, Volunteer or Partner",
  description:
    "Ways to support Jeevansphere Foundation: donate by UPI, volunteer or intern, partner through CSR, give on special occasions, or spread the word.",
  alternates: { canonical: "/get-involved" },
};

const ways = [
  { icon: Heart, title: "Donate", text: "Give by UPI in under a minute. Choose a cause, or let us direct it where it's needed most.", href: "/donate", cta: "Donate now", tone: "orange" as const },
  { icon: HandHeart, title: "Volunteer", text: "Teach, help at health camps and events, or lend professional skills, in person or from home.", href: "/get-involved/volunteer", cta: "Sign up", tone: "brand" as const },
  { icon: GraduationCap, title: "Intern with us", text: "Students and graduates: gain real experience in the social sector, with a certificate.", href: "/get-involved/volunteer", cta: "Apply as an intern", tone: "violet" as const },
  { icon: Handshake, title: "Partner / CSR", text: "Companies, schools, hospitals and NGOs: let's design programmes together.", href: "/get-involved/partner", cta: "Start a conversation", tone: "emerald" as const },
  { icon: Gift, title: "Give on special days", text: "Mark a birthday, anniversary, festival or a loved one's memory with a dedicated donation.", href: "/donate", cta: "Dedicate a gift", tone: "rose" as const },
  { icon: Share2, title: "Spread the word", text: "Follow us, share our stories on WhatsApp, and tell your friends. It costs nothing and helps a lot.", href: "/stories", cta: "Read and share", tone: "amber" as const },
];

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Everyone can <Accent light>do something</Accent>
          </>
        }
        description="Give money, time, skills or your voice. Every kind of support moves our work forward."
        crumbs={[{ label: "Get involved" }]}
      />
      <Section>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {ways.map(({ icon: Icon, title, text, href, cta, tone }, i) => (
            <article
              key={title}
              data-reveal
              style={{ "--d": `${(i % 3) * 80}ms` } as React.CSSProperties}
              className="group relative flex flex-col overflow-hidden rounded-[1.75rem] border border-sand-dark bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-36px_rgb(36_22_69/0.5)]"
            >
              <div className="relative aspect-[16/7] overflow-hidden">
                <Artwork tone={tone} icon={Icon} iconPosition="center" variant={((i % 3) + 1) as 1 | 2 | 3} fill className="transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h2 className="font-display text-2xl font-semibold text-brand-900">{title}</h2>
                <p className="mt-2 flex-1 leading-relaxed text-muted">{text}</p>
                <Link href={href} className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-700 after:absolute after:inset-0">
                  {cta} <ArrowIcon />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Section>
      <DonateBand />
    </>
  );
}
