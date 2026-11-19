import { BadgeCheck, CalendarDays, FileText, MapPin, Receipt, Scale } from "lucide-react";
import Link from "next/link";
import type { SiteEvent } from "@/content/events";
import type { Story } from "@/content/stories";
import { causes } from "@/content/causes";
import { cn, formatDate } from "@/lib/utils";
import { Artwork } from "../ui/artwork";
import { ArrowIcon } from "../ui/button";

/** True, verifiable facts only: no invented impact numbers. */
export function StatsGrid({ light }: { light?: boolean }) {
  const stats = [
    { value: 5, suffix: "", label: "focus areas from our registered objectives" },
    { value: 36, suffix: "", label: "states & union territories we're registered to serve" },
    { value: 0, prefix: "₹", suffix: "", label: "gateway fees: UPI goes straight to our bank" },
    { value: 100, suffix: "%", label: "of income used only for charitable objectives" },
  ];
  return (
    <dl className="grid grid-cols-1 gap-3 min-[340px]:grid-cols-2">
      {stats.map((s, i) => (
        <div
          key={s.label}
          data-reveal
          style={{ "--d": `${i * 80}ms` } as React.CSSProperties}
          className={cn(
            "rounded-2xl p-5 sm:p-6",
            light ? "bg-white/[0.06] ring-1 ring-white/10" : "border border-sand-dark bg-white",
          )}
        >
          <dt className="sr-only">{s.label}</dt>
          <dd>
            <span
              className={cn("block font-display text-[clamp(2.2rem,1.6rem+2vw,3.4rem)] font-semibold leading-none", light ? "text-white" : "text-brand-900")}
              data-count={s.value}
              data-prefix={s.prefix ?? ""}
              data-suffix={s.suffix}
            >
              {s.prefix ?? ""}
              {s.value}
              {s.suffix}
            </span>
            <span className={cn("mt-2 block text-sm leading-snug", light ? "text-brand-200" : "text-muted")}>{s.label}</span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Commitments() {
  const items = [
    { icon: Scale, title: "Not for profit, by law", text: "As a Section 8 company, every rupee is used only for our objectives. Nothing is paid to members as profit." },
    { icon: FileText, title: "Audited every year", text: "Our accounts are examined by qualified auditors every year, and we publish what we can." },
    { icon: Receipt, title: "A receipt for every rupee", text: "Every donation is matched with our bank statement and receipted by email." },
    { icon: BadgeCheck, title: "Open about our work", text: "Registrations, policies and reports live on our Transparency page." },
  ];
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map(({ icon: Icon, title, text }, i) => (
        <div
          key={title}
          data-spotlight
          data-reveal
          style={{ "--d": `${i * 90}ms` } as React.CSSProperties}
          className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.08] sm:p-7"
        >
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sun-400/15 text-sun-300 ring-1 ring-sun-300/30 transition group-hover:bg-sun-400 group-hover:text-brand-950">
            <Icon className="h-6 w-6" aria-hidden="true" />
          </span>
          <h3 className="mt-6 font-display text-xl font-semibold text-white">{title}</h3>
          <p className="mt-2 leading-relaxed text-brand-200">{text}</p>
        </div>
      ))}
    </div>
  );
}

export function EventCard({ event, index = 0 }: { event: SiteEvent; index?: number }) {
  const d = new Date(event.date);
  return (
    <article
      data-reveal
      style={{ "--d": `${index * 80}ms` } as React.CSSProperties}
      className="group flex flex-col gap-5 rounded-3xl border border-sand-dark bg-white p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-30px_rgb(36_22_69/0.45)] min-[420px]:flex-row sm:p-6"
    >
      <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-mesh-dark text-white">
        <span className="text-xs font-bold uppercase tracking-wider text-sun-300">
          {d.toLocaleString("en-IN", { month: "short", timeZone: "Asia/Kolkata" })}
        </span>
        <span className="font-display text-3xl font-semibold leading-none">
          {d.toLocaleString("en-IN", { day: "numeric", timeZone: "Asia/Kolkata" })}
        </span>
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-xl font-semibold text-brand-900">{event.title}</h3>
        <p className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-4 w-4" aria-hidden="true" />
            {formatDate(event.date)}
            {event.time && `, ${event.time}`}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {event.venue}
          </span>
        </p>
        <p className="mt-3 leading-relaxed text-muted">{event.description}</p>
        {event.registrationUrl && (
          <a href={event.registrationUrl} className="mt-3 inline-flex items-center gap-1.5 font-semibold text-brand-700">
            Register <ArrowIcon />
          </a>
        )}
      </div>
    </article>
  );
}

export function StoryCard({ story, featured, index = 0 }: { story: Story; featured?: boolean; index?: number }) {
  const cause = causes.find((c) => c.slug === story.cause);
  return (
    <article
      data-reveal
      style={{ "--d": `${index * 80}ms` } as React.CSSProperties}
      className={cn(
        "group relative grid overflow-hidden rounded-[1.75rem] border border-sand-dark bg-white transition duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_-36px_rgb(36_22_69/0.5)]",
        featured && "lg:grid-cols-2",
      )}
    >
      <div className={cn("relative overflow-hidden", featured ? "aspect-[16/10] lg:aspect-auto lg:min-h-[22rem]" : "aspect-[16/10]")}>
        <Artwork
          tone={cause?.tone ?? "brand"}
          icon={cause?.icon}
          iconPosition="center"
          variant={2}
          fill
          className="transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className={cn("flex flex-col p-6", featured && "lg:justify-center lg:p-10")}>
        <p className="text-sm font-medium text-ember-600">
          <time dateTime={story.date}>{formatDate(story.date)}</time>
        </p>
        <h3 className={cn("mt-2 font-display font-semibold leading-snug text-brand-900", featured ? "text-[clamp(1.5rem,1.2rem+1.2vw,2.4rem)]" : "text-xl")}>
          <Link href={`/stories/${story.slug}`} className="after:absolute after:inset-0">
            {story.title}
          </Link>
        </h3>
        <p className={cn("mt-3 flex-1 leading-relaxed text-muted", featured && "text-lead")}>{story.excerpt}</p>
        <span className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-700">
          Read the story <ArrowIcon />
        </span>
      </div>
    </article>
  );
}
