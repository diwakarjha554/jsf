import { BadgeCheck, FileText, Receipt, Scale } from "lucide-react";
import Link from "next/link";
import { eventTypes } from "@/content/events";
import { Artwork } from "../ui/artwork";
import { ArrowIcon } from "../ui/button";
import { Accent } from "../ui/layout";
import { GlowBorderCard } from "../vendor/vengeance/glow-border-card";
import { RevealList } from "../vendor/vengeance/reveal-list";

/** Trust pillars with rotating glow borders (Vengeance UI Glow Border Card). */
export function TrustGlow() {
  const items = [
    { icon: Scale, title: "Not for profit, by law", text: "As a Section 8 company, every rupee is used only for our objectives. Nothing is paid to members as profit." },
    { icon: FileText, title: "Audited every year", text: "Our accounts are examined by qualified auditors every year, and we publish what we can." },
    { icon: Receipt, title: "A receipt for every rupee", text: "Every donation is matched with our bank statement and receipted by email." },
    { icon: BadgeCheck, title: "Open about our work", text: "Registrations, policies and reports live on our Transparency page." },
  ];
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ icon: Icon, title, text }, i) => (
        <div key={title} data-reveal style={{ "--d": `${i * 90}ms` } as React.CSSProperties}>
          <GlowBorderCard className="h-full" delay={i * 1.6} duration={9}>
            <div className="flex h-full flex-col p-6 sm:p-8">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sun-300 ring-1 ring-white/15">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h3 className="mt-7 font-display text-2xl font-semibold leading-tight text-white">{title}</h3>
              <p className="mt-3 leading-relaxed text-brand-200">{text}</p>
            </div>
          </GlowBorderCard>
        </div>
      ))}
    </div>
  );
}

/** Event types as an editorial list with a cursor-following preview (Vengeance UI Image Reveal List). */
export function EventsReveal() {
  const subtitles = ["Navratri & Dussehra", "All through the year", "In underserved neighbourhoods", "Schools & communities"];
  return (
    <RevealList
      items={eventTypes.map((e, i) => {
        const Icon = e.icon;
        return {
          key: e.title,
          number: `0${i + 1}`,
          title: e.title,
          subtitle: subtitles[i] ?? "",
          body: e.text,
          preview: <Artwork tone={e.tone} icon={Icon} iconPosition="center" variant={((i % 3) + 1) as 1 | 2 | 3} className="h-full w-full rounded-none" />,
        };
      })}
    />
  );
}

/** Readable, wrapping links with a rising colour fill. */
export function InvolveRows() {
  const rows = [
    { n: "01", title: "Volunteer", text: "Teach, organise, heal, design, or simply show up.", href: "/get-involved/volunteer" },
    { n: "02", title: "Partner with us", text: "Companies, schools, hospitals and NGOs: let's build programmes together.", href: "/get-involved/partner" },
    { n: "03", title: "Donate", text: "Give by UPI in under a minute. No gateway fees.", href: "/donate" },
  ];
  return (
    <ul className="border-t border-brand-900/15">
      {rows.map((r) => (
        <li key={r.href} className="border-b border-brand-900/15">
          <Link
            href={r.href}
           
            className="group relative isolate grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 overflow-hidden px-3 py-6 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:gap-6 sm:px-5 md:py-9"
          >
            <span
              className="absolute inset-0 -z-10 origin-bottom scale-y-0 bg-[linear-gradient(110deg,var(--color-sun-200),var(--color-sun-400)_50%,var(--color-ember-400))] transition-transform duration-700 ease-[cubic-bezier(.19,1,.22,1)] group-hover:scale-y-100"
              aria-hidden="true"
            />
            <span className="hidden font-display text-sm font-semibold text-ember-600 transition-colors group-hover:text-brand-950 sm:block">
              {r.n}
            </span>
            <span className="min-w-0">
              <span className="block font-display text-[clamp(1.75rem,1rem+3.5vw,4.75rem)] font-semibold leading-[1.15] tracking-[-0.035em] text-brand-900">
                {r.title}
              </span>
              <span className="mt-2 block max-w-xl text-[15px] text-muted transition-colors group-hover:text-brand-950/80">{r.text}</span>
            </span>
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-brand-900/15 text-brand-900 transition-all duration-300 group-hover:-rotate-45 group-hover:border-brand-950 group-hover:bg-brand-950 group-hover:text-sun-300 sm:h-14 sm:w-14">
              <ArrowIcon className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function SectionTitle({ children, light, className }: { children: React.ReactNode; light?: boolean; className?: string }) {
  return (
    <h2
      className={`max-w-[20ch] font-display text-[clamp(2rem,1.25rem+3vw,4.5rem)] font-semibold leading-[1.12] tracking-[-0.035em] text-balance ${light ? "text-white" : "text-brand-900"} ${className ?? ""}`}
      data-reveal="blur"
    >
      {children}
    </h2>
  );
}

export { Accent };
