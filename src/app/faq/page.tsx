import type { Metadata } from "next";
import { DonateBand } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { Section } from "@/components/ui/layout";
import { FaqList, faqJsonLd, JsonLd } from "@/components/ui/misc";
import { Accent } from "@/components/ui/layout";
import { donationFaqs, partnerFaqs, volunteerFaqs } from "@/content/faqs";

export const metadata: Metadata = {
  title: "FAQ: Donations, Receipts, 80G & Volunteering",
  description:
    "Answers to common questions about donating to Jeevansphere Foundation by UPI, receipts, 80G tax benefit, refunds, volunteering and partnerships.",
  alternates: { canonical: "/faq" },
};

const groups = [
  { id: "donations", title: "Donations", faqs: donationFaqs },
  { id: "volunteering", title: "Volunteering", faqs: volunteerFaqs },
  { id: "partnerships", title: "Partnerships", faqs: partnerFaqs },
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        title={
          <>
            Questions, <Accent light>answered</Accent>
          </>
        }
        description="Can't find your answer? Write to us from the Contact page."
        crumbs={[{ label: "FAQ" }]}
      />
      <Section>
        <div className="grid gap-10 lg:grid-cols-[16rem_1fr] xl:gap-16">
          <nav aria-label="FAQ sections" className="lg:sticky lg:top-28 lg:self-start">
            <ul className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 lg:mx-0 lg:flex-col lg:px-0">
              {groups.map((g) => (
                <li key={g.id} className="shrink-0">
                  <a
                    href={`#${g.id}`}
                    className="flex items-center justify-between gap-3 rounded-xl border border-sand-dark bg-white px-4 py-3 text-sm font-semibold text-brand-900 transition hover:border-brand-300"
                  >
                    {g.title}
                    <span className="text-muted">{g.faqs.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-12">
            {groups.map((g) => (
              <div key={g.id} id={g.id} className="scroll-mt-28">
                <h2 className="text-title font-display font-semibold text-brand-900" data-reveal="blur">
                  {g.title}
                </h2>
                <FaqList faqs={g.faqs} className="mt-6" />
              </div>
            ))}
          </div>
        </div>
      </Section>
      <DonateBand />
      <JsonLd data={faqJsonLd([...donationFaqs, ...volunteerFaqs, ...partnerFaqs])} />
    </>
  );
}
