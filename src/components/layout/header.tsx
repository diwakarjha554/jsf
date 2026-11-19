import { ChevronDown, Heart, Mail, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { mainNav, type NavItem } from "@/content/navigation";
import { isPlaceholder, site } from "@/content/site";
import { cn } from "@/lib/utils";
import { ArrowIcon, ButtonLink } from "../ui/button";
import { Container } from "../ui/layout";
import { Logo } from "../ui/logo";
import { TextRoll } from "../vendor/skiper/text-roll";
import { MobileNav } from "./mobile-nav";

function TrustStrip() {
  const reg = [site.legal.shortType, "Registered in Delhi"];
  if (!isPlaceholder(site.legal.cin)) reg.push(`CIN ${site.legal.cin}`);
  if (site.legal.tax80g.enabled) reg.push("80G approved");
  return (
    <div className="relative z-50 bg-brand-950 text-brand-200">
      <Container className="flex h-9 items-center justify-between gap-4 text-xs">
        <p className="flex min-w-0 items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-sun-400" aria-hidden="true" />
          <span className="truncate">{reg.join("  ·  ")}</span>
        </p>
        <div className="hidden items-center gap-5 md:flex">
          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-sun-400" aria-hidden="true" />
            Donate by UPI. No gateway fees.
          </span>
          <a href={`mailto:${site.contact.email}`} className="flex items-center gap-1.5 transition hover:text-white">
            <Mail className="h-3.5 w-3.5" aria-hidden="true" />
            {site.contact.email}
          </a>
        </div>
      </Container>
    </div>
  );
}

function Dropdown({ item }: { item: NavItem }) {
  const wide = (item.children?.length ?? 0) > 3;
  return (
    <div
      className={cn(
        "invisible absolute top-full z-50 pt-4 opacity-0 transition duration-300 [transform:translateY(10px)] group-hover:visible group-hover:opacity-100 group-hover:[transform:translateY(0)] group-focus-within:visible group-focus-within:opacity-100 group-focus-within:[transform:translateY(0)]",
        wide ? "left-1/2 w-[min(48rem,calc(100vw-4rem))] -translate-x-1/2" : "left-1/2 w-[22rem] -translate-x-1/2",
      )}
    >
      <div className="overflow-hidden rounded-3xl border border-sand-dark bg-white/95 p-2 text-ink shadow-[0_30px_80px_-30px_rgb(22_13_45/0.45)] backdrop-blur-xl">
        <div className={cn(wide && "grid grid-cols-[1fr_15rem] gap-2")}>
          <ul className={cn(wide && "grid grid-cols-2 gap-1")}>
            {item.children!.map((child) => {
              const Icon = child.icon;
              return (
                <li key={child.href + child.label}>
                  <Link href={child.href} className="group/item flex gap-3 rounded-2xl p-3 transition hover:bg-cream focus-visible:bg-cream">
                    {Icon && (
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 transition duration-300 group-hover/item:rotate-[-8deg] group-hover/item:bg-sun-400 group-hover/item:text-brand-950">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                    <span>
                      <span className="block font-semibold text-brand-900">{child.label}</span>
                      {child.description && <span className="mt-0.5 block text-sm leading-snug text-muted">{child.description}</span>}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          {wide && (
            <Link href="/donate?cause=general" className="grain group/cta relative flex flex-col justify-between overflow-hidden rounded-2xl bg-mesh-dark p-5 text-white">
              <Heart className="h-7 w-7 text-sun-400" fill="currentColor" aria-hidden="true" />
              <span>
                <span className="block font-display text-xl font-semibold leading-tight">Give where it&apos;s needed most</span>
                <span className="mt-2 flex items-center gap-1.5 text-sm text-sun-300">
                  Donate by UPI <ArrowIcon className="group-hover/cta:translate-x-1" />
                </span>
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  return (
    <>
      <TrustStrip />
      <header
        id="site-header"
        data-scrolled="false"
        data-tone="auto"
        className="sticky top-0 z-40 border-b border-transparent bg-cream/80 text-ink backdrop-blur-md transition-[background,box-shadow,border-color,color] duration-300"
      >
        <Container className="flex h-[4.25rem] items-center justify-between gap-4 lg:h-[4.75rem]">
          <Link href="/" aria-label={`${site.name}, home`} className="rounded-xl">
            <Logo className="logo-on-light" />
            <Logo light className="logo-on-dark" />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-0.5 xl:gap-2">
              {mainNav.map((item) => (
                <li key={item.label} className="group relative">
                  <Link
                    href={item.href}
                    className="relative inline-flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-medium transition-colors"
                  >
                    <TextRoll>{item.label}</TextRoll>
                    {item.children && (
                      <ChevronDown
                        className="h-4 w-4 opacity-60 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180"
                        aria-hidden="true"
                      />
                    )}
                  </Link>
                  {item.children && <Dropdown item={item} />}
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {/* Wrapper handles visibility: on phones the bottom bar carries the Donate button. */}
            <span className="hidden sm:block">
              <ButtonLink href="/donate" size="sm" className="px-5">
                <Heart className="h-4 w-4" fill="currentColor" aria-hidden="true" />
                Donate
              </ButtonLink>
            </span>
            <MobileNav />
          </div>
        </Container>
      </header>
    </>
  );
}
