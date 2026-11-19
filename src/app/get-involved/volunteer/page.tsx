import type { Metadata } from "next";
import { Award, Clock, Heart } from "lucide-react";
import { VolunteerForm } from "@/components/forms/volunteer-form";
import { PageHero } from "@/components/sections/page-hero";
import { Accent, Section } from "@/components/ui/layout";
import { FaqList, faqJsonLd, JsonLd } from "@/components/ui/misc";
import { volunteerFaqs } from "@/content/faqs";

export const metadata: Metadata = {
  title: "Volunteer or Intern with an NGO in Delhi",
  description:
    "Volunteer or intern with Jeevansphere Foundation in Delhi or remotely: teaching, health camps, events, design, fundraising and more. Sign up in two minutes.",
  alternates: { canonical: "/get-involved/volunteer" },
};

const reasons = [
  { icon: Heart, title: "Make a real difference", text: "Work directly with children, families and elders in your city." },
  { icon: Clock, title: "On your schedule", text: "Weekdays, weekends or remote: give the time you can." },
  { icon: Award, title: "Learn and grow", text: "Gain experience and a certificate, and meet people who care." },
];

export default function VolunteerPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Give your time, <Accent light>change a life</Accent>
          </>
        }
        description="Whether you can teach, organise, heal, design or simply show up, there's a place for you."
        crumbs={[{ label: "Get involved", href: "/get-involved" }, { label: "Volunteer" }]}
      />
      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.35fr] xl:gap-16">
          <div className="lg:sticky lg:top-28">
            <h2 className="text-title font-display font-semibold text-brand-900" data-reveal="blur">
              What to <Accent>expect</Accent>
            </h2>
            <ul className="mt-8 space-y-3">
              {reasons.map(({ icon: Icon, title, text }, i) => (
                <li
                  key={title}
                  data-reveal="left"
                  style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
                  className="flex gap-4 rounded-2xl border border-sand-dark bg-white p-5"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-900 text-sun-300">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-brand-900">{title}</h3>
                    <p className="mt-1 leading-relaxed text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <h3 className="mt-10 font-display text-xl font-semibold text-brand-900">Questions</h3>
            <FaqList faqs={volunteerFaqs} className="mt-4" />
          </div>
          <div data-reveal className="min-w-0 rounded-[2rem] bg-white p-5 shadow-[0_40px_80px_-50px_rgb(36_22_69/0.55)] ring-1 ring-sand-dark min-[400px]:p-6 sm:p-10">
            <h2 className="font-display text-[clamp(1.5rem,1.3rem+0.8vw,2.1rem)] font-semibold text-brand-900">Sign up to volunteer</h2>
            <p className="mb-8 mt-1 text-muted">Takes about two minutes. We&apos;ll be in touch within a week.</p>
            <VolunteerForm />
          </div>
        </div>
      </Section>
      <JsonLd data={faqJsonLd(volunteerFaqs)} />
    </>
  );
}
