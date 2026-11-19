import { BookOpen, Handshake, HandHeart, Heart, ScrollText, Users, type LucideIcon } from "lucide-react";
import { causes } from "./causes";

export type NavLink = { label: string; href: string; description?: string; icon?: LucideIcon };
export type NavItem = NavLink & { children?: NavLink[] };

export const mainNav: NavItem[] = [
  {
    label: "About",
    href: "/about",
    children: [
      { label: "About us", href: "/about", description: "Our story, vision and values", icon: BookOpen },
      { label: "Our team", href: "/about/team", description: "The people behind the foundation", icon: Users },
      { label: "Transparency", href: "/transparency", description: "Registrations, documents and funds", icon: ScrollText },
    ],
  },
  {
    label: "Our work",
    href: "/our-work",
    children: causes.map((c) => ({ label: c.title, href: `/our-work/${c.slug}`, description: c.tagline, icon: c.icon })),
  },
  { label: "Events", href: "/events" },
  { label: "Stories", href: "/stories" },
  {
    label: "Get involved",
    href: "/get-involved",
    children: [
      { label: "Volunteer or intern", href: "/get-involved/volunteer", description: "Give your time and skills", icon: HandHeart },
      { label: "Partner with us", href: "/get-involved/partner", description: "CSR, institutions and NGOs", icon: Handshake },
      { label: "Donate", href: "/donate", description: "Give by UPI in under a minute", icon: Heart },
    ],
  },
  { label: "Contact", href: "/contact" },
];

export const footerNav = {
  work: causes.map((c) => ({ label: c.title, href: `/our-work/${c.slug}` })),
  involved: [
    { label: "Donate", href: "/donate" },
    { label: "Volunteer", href: "/get-involved/volunteer" },
    { label: "Partner with us", href: "/get-involved/partner" },
    { label: "Events", href: "/events" },
    { label: "Stories", href: "/stories" },
  ],
  about: [
    { label: "About us", href: "/about" },
    { label: "Our team", href: "/about/team" },
    { label: "Transparency", href: "/transparency" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Refund Policy", href: "/refund-policy" },
  ],
};
