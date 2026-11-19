import type { Metadata } from "next";
import { Building, GraduationCap, HeartHandshake, Landmark, Stethoscope } from "lucide-react";
import { PartnerForm } from "@/components/forms/partner-form";
import { PageHero } from "@/components/sections/page-hero";
import { Accent, Section, SectionHeading } from "@/components/ui/layout";
import { FaqList, faqJsonLd, JsonLd } from "@/components/ui/misc";
import { partnerFaqs } from "@/content/faqs";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Partner with Us: CSR, Institutions & NGOs",
  description:
    "Partner with Jeevansphere Foundation on education, healthcare, social welfare and community programmes: CSR funding, programme partnerships, employee volunteering and sponsorships.",
  alternates: { canonical: "/get-involved/partner" },
};

const partners = [
  { icon: Building, title: "Companies (CSR)", text: "Fund or co-design programmes aligned with Schedule VII, and engage your employees." },
  { icon: GraduationCap, title: "Schools & colleges", text: "Learning support, digital literacy, internships and research." },
  { icon: Stethoscope, title: "Hospitals & clinics", text: "Health camps, diagnostics and awareness drives." },
  { icon: HeartHandshake, title: "NGOs & community groups", text: "Reach more people by working together on the ground." },
  { icon: Landmark, title: "Government", text: "Support public programmes and schemes in our focus areas." },
];

export default function PartnerPage() {
  const regs: [string, string][] = [
    ["Legal status", site.legal.type],
    ["12A / 80G", site.legal.tax80g.enabled ? `80G approval ${site.legal.tax80g.approvalNumber}` : "Applied / in process"],
    ["CSR-1", site.legal.csr1 || "In process"],
    ["NGO Darpan", site.legal.ngoDarpan || "In process"],
  ];
  return (
    <>
      <PageHero
        title={
          <>
            Let&apos;s build something <Accent light>lasting, together</Accent>
          </>
        }
        description="We work with companies, institutions, NGOs and government to do more than any of us could alone."
        crumbs={[{ label: "Get involved", href: "/get-involved" }, { label: "Partner with us" }]}
      />
      <Section>
        <SectionHeading
          title={
            <>
              Partnership <Accent>opportunities</Accent>
            </>
          }
        />
        <ul className="mt-10 grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 lg:grid-cols-5">
          {partners.map(({ icon: Icon, title, text }, i) => (
            <li
              key={title}
              data-reveal
              style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
              className="group rounded-3xl border border-sand-dark bg-white p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgb(36_22_69/0.45)]"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700 transition group-hover:bg-sun-400 group-hover:text-brand-950">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-brand-900">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </Section>
      <Section tone="white">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.35fr] xl:gap-16">
          <div className="lg:sticky lg:top-28">
            <h2 className="text-title font-display font-semibold text-brand-900" data-reveal="blur">
              Our compliance <Accent>status</Accent>
            </h2>
            <dl data-reveal className="mt-8 divide-y divide-white/10 overflow-hidden rounded-3xl bg-mesh-dark text-white">
              {regs.map(([k, v]) => (
                <div key={k} className="px-6 py-4">
                  <dt className="text-sm text-brand-200">{k}</dt>
                  <dd className="mt-0.5 font-semibold">{v}</dd>
                </div>
              ))}
            </dl>
            <h3 className="mt-10 font-display text-xl font-semibold text-brand-900">Questions</h3>
            <FaqList faqs={partnerFaqs} className="mt-4" />
          </div>
          <div data-reveal className="min-w-0 rounded-[2rem] bg-cream p-5 ring-1 ring-sand-dark min-[400px]:p-6 sm:p-10">
            <h2 className="font-display text-[clamp(1.5rem,1.3rem+0.8vw,2.1rem)] font-semibold text-brand-900">Tell us about your idea</h2>
            <p className="mb-8 mt-1 text-muted">Our partnerships team replies within three working days.</p>
            <PartnerForm />
          </div>
        </div>
      </Section>
      <JsonLd data={faqJsonLd(partnerFaqs)} />
    </>
  );
}
