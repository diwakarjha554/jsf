import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import { Suspense, type ReactNode } from "react";
import { FloatingActions } from "@/components/layout/floating";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SiteEffects } from "@/components/ui/effects";
import { JsonLd } from "@/components/ui/misc";
import { site, socialLinks } from "@/content/site";
import "./globals.css";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-bricolage", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });
const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} | Delhi NGO for Education, Healthcare & Social Welfare`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "NGO in Delhi",
    "donate to NGO",
    "donate by UPI",
    "child education NGO",
    "healthcare NGO India",
    "social welfare",
    "Ram Leela Delhi",
    "Section 8 company",
    "volunteer in Delhi",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    url: "/",
    title: `${site.name} | Education, Healthcare & Social Welfare`,
    description: site.description,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#160d2d",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: site.name,
  legalName: site.legal.legalName,
  url: site.url,
  logo: `${site.url}/icon.svg`,
  description: site.description,
  email: site.contact.email,
  foundingDate: site.legal.incorporatedYear,
  areaServed: "IN",
  address: {
    "@type": "PostalAddress",
    addressLocality: "New Delhi",
    addressRegion: "Delhi",
    addressCountry: "IN",
  },
  sameAs: socialLinks().map(([, href]) => href),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN" className={`${bricolage.variable} ${instrument.variable} ${jakarta.variable}`}>
      <body className="min-h-dvh pb-[4.75rem] sm:pb-0">
        <a
          href="#main"
          className="sr-only rounded-xl bg-brand-900 px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Suspense fallback={null}>
          <FloatingActions />
        </Suspense>
        <SiteEffects />
        <JsonLd data={orgJsonLd} />
      </body>
    </html>
  );
}
