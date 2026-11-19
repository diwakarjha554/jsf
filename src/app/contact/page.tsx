import type { Metadata } from "next";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/forms/contact-form";
import { PageHero } from "@/components/sections/page-hero";
import { Accent, Section } from "@/components/ui/layout";
import { WhatsAppIcon } from "@/components/ui/social-icons";
import { isPlaceholder, site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Jeevansphere Foundation, Delhi: questions about donations, volunteering, partnerships or our work.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const c = site.contact;
  const items = [
    { icon: Mail, label: "Email", value: c.email, href: `mailto:${c.email}` },
    !isPlaceholder(c.phone) && { icon: Phone, label: "Phone", value: c.phone, href: `tel:${c.phone.replace(/\s/g, "")}` },
    c.whatsapp && { icon: WhatsAppIcon, label: "WhatsApp", value: "Chat with us", href: `https://wa.me/${c.whatsapp}` },
    { icon: MapPin, label: c.addressLines.some(isPlaceholder) ? "Location" : "Registered office", value: c.addressLines.filter((line) => !isPlaceholder(line)).join(", "), href: c.mapLink || undefined },
    { icon: Clock, label: "Office hours", value: c.hours },
  ].filter(Boolean) as { icon: React.ComponentType<{ className?: string }>; label: string; value: string; href?: string }[];

  return (
    <>
      <PageHero
        title={
          <>
            We&apos;d love to <Accent light>hear from you</Accent>
          </>
        }
        description="Questions about donating, volunteering or partnering? Write to us and we'll reply within two working days."
        crumbs={[{ label: "Contact" }]}
      />
      <Section>
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.5fr] xl:gap-16">
          <div className="space-y-3 lg:sticky lg:top-28">
            {items.map(({ icon: Icon, label, value, href }, i) => (
              <div
                key={label}
                data-reveal="left"
                style={{ "--d": `${i * 70}ms` } as React.CSSProperties}
                className="group flex gap-4 rounded-2xl border border-sand-dark bg-white p-5 transition hover:shadow-[0_20px_40px_-28px_rgb(36_22_69/0.45)]"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-900 text-sun-300 transition group-hover:bg-sun-400 group-hover:text-brand-950">
                  <Icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-muted">{label}</p>
                  {href ? (
                    <a href={href} className="break-words font-semibold text-brand-900 hover:text-brand-700">
                      {value}
                    </a>
                  ) : (
                    <p className="font-semibold text-brand-900">{value}</p>
                  )}
                </div>
              </div>
            ))}
            {c.mapEmbedUrl && (
              <iframe
                src={c.mapEmbedUrl}
                title="Map to our office"
                loading="lazy"
                className="aspect-[4/3] w-full rounded-2xl border border-sand-dark"
                referrerPolicy="no-referrer-when-downgrade"
              />
            )}
          </div>
          <div data-reveal className="min-w-0 rounded-[2rem] bg-white p-5 shadow-[0_40px_80px_-50px_rgb(36_22_69/0.55)] ring-1 ring-sand-dark min-[400px]:p-6 sm:p-10">
            <h2 className="mb-8 font-display text-[clamp(1.5rem,1.3rem+0.8vw,2.1rem)] font-semibold text-brand-900">Send us a message</h2>
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
