import type { Metadata } from "next";
import { CircleCheck, Clock, FileText, Globe, Receipt, Scale } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/sections/page-hero";
import { ArrowIcon } from "@/components/ui/button";
import { Accent, Section, SectionHeading } from "@/components/ui/layout";
import { isPlaceholder, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Transparency: Registrations, Documents & Accounts",
  description:
    "Jeevansphere Foundation's registrations, legal documents, governance, how donations are used, and audited accounts. Section 8 non-profit registered in Delhi.",
  alternates: { canonical: "/transparency" },
};

type Doc = { title: string; detail: string; available: boolean; href?: string };

export default function TransparencyPage() {
  const l = site.legal;
  // Add PDFs to /public/documents and set href + available: true as they become ready.
  const documents: Doc[] = [
    { title: "Certificate of Incorporation", detail: "Ministry of Corporate Affairs", available: false },
    { title: "Memorandum & Articles of Association", detail: "MOA and AOA", available: false },
    { title: "Foundation PAN", detail: isPlaceholder(l.pan) ? "To be published" : l.pan, available: !isPlaceholder(l.pan) },
    { title: "12A registration", detail: "Income Tax Department", available: false },
    {
      title: "80G approval",
      detail: l.tax80g.enabled ? `${l.tax80g.approvalNumber} (valid ${l.tax80g.validFrom} to ${l.tax80g.validTo})` : "Application in process",
      available: l.tax80g.enabled,
    },
    { title: "CSR-1 registration", detail: l.csr1 || "In process", available: Boolean(l.csr1) },
    { title: "NGO Darpan ID", detail: l.ngoDarpan || "In process", available: Boolean(l.ngoDarpan) },
  ];

  const pillars = [
    {
      icon: Scale,
      title: "Not for profit, by law",
      text: "Our Memorandum of Association requires all income and property to be used only for our objectives. No dividend or profit can be paid to members, and assets can never be distributed to them.",
    },
    {
      icon: Receipt,
      title: "Audited accounts",
      text: "True accounts are kept of every rupee received and spent, and audited by qualified auditors every year. Our first audited accounts will be published here after the 2026-27 financial year.",
    },
    {
      icon: Globe,
      title: "Indian donors only",
      text: l.fcraRegistered
        ? "We are registered under the Foreign Contribution (Regulation) Act."
        : "We are not registered under the Foreign Contribution (Regulation) Act (FCRA), so we accept donations only from Indian citizens, from Indian sources.",
    },
  ];

  return (
    <>
      <PageHero
        title={
          <>
            Open about who we are <Accent light>and how we use your money</Accent>
          </>
        }
        description="We believe donors deserve to see everything: our registrations, our governance and our accounts."
        crumbs={[{ label: "About us", href: "/about" }, { label: "Transparency" }]}
      />

      <Section>
        <SectionHeading
          title={
            <>
              Legal <Accent>documents</Accent>
            </>
          }
          description="Documents are added here as they're issued."
        />
        <ul className="mt-10 grid gap-3 md:grid-cols-2">
          {documents.map((d, i) => (
            <li
              key={d.title}
              data-reveal
              style={{ "--d": `${(i % 4) * 60}ms` } as React.CSSProperties}
              className="flex items-start gap-4 rounded-2xl border border-sand-dark bg-white p-5"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${d.available ? "bg-emerald-100 text-emerald-700" : "bg-sun-100 text-sun-800"}`}
              >
                {d.available ? <CircleCheck className="h-5 w-5" aria-hidden="true" /> : <Clock className="h-5 w-5" aria-hidden="true" />}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-brand-900">{d.title}</h3>
                <p className="mt-0.5 text-sm text-muted">{d.detail}</p>
              </div>
              {d.href && (
                <a href={d.href} className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700" download>
                  <FileText className="h-4 w-4" aria-hidden="true" /> PDF
                </a>
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="dark">
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map(({ icon: Icon, title, text }, i) => (
            <article
              key={title}
              data-spotlight
              data-reveal
              style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm sm:p-8"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sun-400 text-brand-950">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-6 font-display text-2xl font-semibold text-white">{title}</h2>
              <p className="mt-3 leading-relaxed text-brand-200">{text}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          <div data-reveal>
            <h2 className="text-title font-display font-semibold text-brand-900">
              Who&apos;s <Accent>accountable</Accent>
            </h2>
            <p className="text-lead mt-5 text-muted">
              The foundation is governed by its board of directors under the Companies Act, 2013. Any change to our
              Memorandum or Articles needs the approval of the Registrar of Companies.
            </p>
            <Link href="/about/team" className="group mt-6 inline-flex items-center gap-2 font-semibold text-brand-700">
              Meet our board <ArrowIcon />
            </Link>
          </div>
          <div data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>
            <h2 className="text-title font-display font-semibold text-brand-900">
              Our <Accent>policies</Accent>
            </h2>
            <ul className="mt-6 grid gap-3">
              {[
                ["Privacy Policy", "/privacy-policy"],
                ["Terms & Conditions", "/terms-and-conditions"],
                ["Refund Policy", "/refund-policy"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center justify-between gap-3 rounded-2xl border border-sand-dark bg-white px-5 py-4 font-semibold text-brand-900 transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-28px_rgb(36_22_69/0.45)]"
                  >
                    <span className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-brand-500" aria-hidden="true" /> {label}
                    </span>
                    <ArrowIcon />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
