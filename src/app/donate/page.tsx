import type { Metadata } from "next";
import { Building, Handshake, Mail } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { DonateFlow } from "@/components/donate/donate-flow";
import { Accent, Container, Section, SectionHeading } from "@/components/ui/layout";
import { FaqList, faqJsonLd, JsonLd } from "@/components/ui/misc";
import { donationFaqs } from "@/content/faqs";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Donate Online by UPI to a Delhi NGO",
  description:
    "Donate to Jeevansphere Foundation by UPI: education, healthcare, social welfare, culture and community development. No gateway fees, receipt for every donation.",
  alternates: { canonical: "/donate" },
};

function FlowSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]" aria-hidden="true">
      <div className="h-[36rem] animate-pulse rounded-4xl bg-white ring-1 ring-sand-dark" />
      <div className="h-64 animate-pulse rounded-4xl bg-brand-900/90" />
    </div>
  );
}

const others = [
  {
    icon: Building,
    title: "Large gifts and bank transfers",
    body: <>For gifts above ₹{site.donation.maxAmount.toLocaleString("en-IN")}, or by cheque, write to us and we&apos;ll help.</>,
  },
  {
    icon: Handshake,
    title: "Companies and CSR",
    body: (
      <>
        Partner with us on a programme.{" "}
        <Link href="/get-involved/partner" className="font-semibold text-brand-700 underline decoration-sun-400 decoration-2 underline-offset-4">
          Start a conversation
        </Link>
        .
      </>
    ),
  },
  {
    icon: Mail,
    title: "Questions?",
    body: (
      <>
        Email{" "}
        <a href={`mailto:${site.contact.email}`} className="break-all font-semibold text-brand-700 underline decoration-sun-400 decoration-2 underline-offset-4">
          {site.contact.email}
        </a>{" "}
        and we&apos;ll reply within two working days.
      </>
    ),
  },
];

export default function DonatePage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-mesh-warm pb-[clamp(3.5rem,2.5rem+3vw,6rem)] pt-[clamp(2rem,1.5rem+2vw,4rem)]">
        <div className="absolute inset-0 -z-10 bg-grid-faint [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]" aria-hidden="true" />
        <Container>
          <div className="max-w-3xl">
            <h1 className="text-display font-display font-semibold text-brand-900" data-reveal="blur">
              Make a <Accent>donation</Accent>
            </h1>
            <p className="text-lead mt-4 text-muted" data-reveal>
              Pay with any UPI app, straight to our bank account. No gateway fees, so your full gift reaches the work.
            </p>
          </div>
          <div className="mt-10">
            <Suspense fallback={<FlowSkeleton />}>
              <DonateFlow />
            </Suspense>
          </div>
        </Container>
      </section>

      <Section tone="white">
        <SectionHeading
          title={
            <>
              Prefer <Accent>another way?</Accent>
            </>
          }
        />
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {others.map(({ icon: Icon, title, body }, i) => (
            <article
              key={title}
              data-reveal
              style={{ "--d": `${i * 80}ms` } as React.CSSProperties}
              className="rounded-3xl border border-sand-dark bg-cream p-6 sm:p-7"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-900 text-sun-300">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold text-brand-900">{title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{body}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="text-title font-display font-semibold text-brand-900" data-reveal="blur">
              Your questions, <Accent>answered</Accent>
            </h2>
            <p className="text-lead mt-5 text-muted" data-reveal>
              Still unsure? Email{" "}
              <a href={`mailto:${site.contact.email}`} className="break-all font-semibold text-brand-700 underline decoration-sun-400 decoration-2 underline-offset-4">
                {site.contact.email}
              </a>
              .
            </p>
          </div>
          <FaqList faqs={donationFaqs} />
        </div>
      </Section>
      <JsonLd data={faqJsonLd(donationFaqs)} />
    </>
  );
}
