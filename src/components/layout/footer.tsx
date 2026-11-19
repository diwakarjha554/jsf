import { Heart, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { footerNav } from "@/content/navigation";
import { isPlaceholder, site, socialLinks } from "@/content/site";
import { NewsletterForm } from "../forms/newsletter-form";
import { ArrowIcon, ButtonLink } from "../ui/button";
import { CurrentYear } from "../ui/client-bits";
import { Accent, Container } from "../ui/layout";
import { Logo } from "../ui/logo";
import { socialIconMap } from "../ui/social-icons";

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="font-display text-sm font-semibold text-white">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="group inline-flex items-center gap-1 text-[15px] text-brand-200 transition hover:text-white">
              {l.label}
              <ArrowIcon className="h-3.5 w-3.5 -translate-x-1 opacity-0 transition group-hover:translate-x-0 group-hover:opacity-100" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const socials = socialLinks();
  return (
    <footer className="grain relative overflow-hidden bg-mesh-dark text-brand-100">
      <Container className="relative">
        {/* CTA row */}
        <div className="flex flex-col gap-8 border-b border-white/10 py-12 md:flex-row md:items-end md:justify-between md:py-16">
          <h2 className="text-display max-w-3xl font-display font-semibold text-white text-balance" data-reveal="blur">
            Let&apos;s build a fairer India, <Accent light>together.</Accent>
          </h2>
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur md:w-[26rem]" data-reveal="fade">
            <h2 className="font-display text-lg font-semibold text-white">Get our monthly update</h2>
            <p className="mt-1 text-sm text-brand-200">News, events and ways to help. No spam.</p>
            <NewsletterForm source="footer" variant="dark" className="mt-4" />
          </div>
        </div>

        <div className="grid gap-10 py-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo light />
            <p className="mt-5 max-w-sm leading-relaxed text-brand-200">{site.mission}</p>
            <ButtonLink href="/donate" className="mt-7">
              <Heart className="h-4 w-4" fill="currentColor" aria-hidden="true" /> Donate by UPI
            </ButtonLink>
          </div>
          <div className="grid grid-cols-1 gap-10 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:col-span-5">
            <Column title="Our work" links={footerNav.work} />
            <Column title="Get involved" links={footerNav.involved} />
            <Column title="About" links={footerNav.about} />
          </div>
          <div className="lg:col-span-3">
            <h2 className="font-display text-sm font-semibold text-white">Contact</h2>
            <ul className="mt-4 space-y-3.5 text-[15px]">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-sun-400" aria-hidden="true" />
                <address className="not-italic">
                  {site.contact.addressLines.filter((line) => !isPlaceholder(line)).map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </address>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-5 w-5 shrink-0 text-sun-400" aria-hidden="true" />
                <a href={`mailto:${site.contact.email}`} className="break-all hover:text-white">
                  {site.contact.email}
                </a>
              </li>
              {!isPlaceholder(site.contact.phone) && (
                <li className="flex gap-3">
                  <Phone className="mt-0.5 h-5 w-5 shrink-0 text-sun-400" aria-hidden="true" />
                  <a href={`tel:${site.contact.phone.replace(/\s/g, "")}`} className="hover:text-white">
                    {site.contact.phone}
                  </a>
                </li>
              )}
            </ul>
            {socials.length > 0 && (
              <ul className="mt-6 flex gap-2" aria-label="Social media">
                {socials.map(([key, href]) => {
                  const Icon = socialIconMap[key];
                  return (
                    <li key={key}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-sun-400 hover:text-brand-950"
                        aria-label={key}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        <div
          className="pointer-events-none select-none overflow-hidden font-display text-[clamp(3.2rem,16vw,15rem)] font-bold leading-[0.8] tracking-tighter text-transparent [-webkit-text-stroke:1px_rgb(255_255_255/0.14)]"
          aria-hidden="true"
        >
          Jeevansphere
        </div>
      </Container>
      <div className="relative border-t border-white/10">
        <Container className="flex flex-col gap-4 py-6 text-sm text-brand-300 md:flex-row md:flex-wrap md:items-center md:justify-between">
          <p>
            © <CurrentYear /> {site.legal.legalName}. {site.legal.type}
            {!isPlaceholder(site.legal.cin) && ` · CIN ${site.legal.cin}`}.
          </p>
          <p className="text-xs text-brand-300/70 md:order-last md:basis-full">
            Some interface effects adapted from{" "}
            <a href="https://skiper-ui.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
              Skiper UI
            </a>{" "}
            and{" "}
            <a href="https://www.vengenceui.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-white">
              Vengeance UI
            </a>{" "}
            (MIT).
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {footerNav.legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
