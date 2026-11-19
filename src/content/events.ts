import { Drum, Flame, HeartPulse, Megaphone, type LucideIcon } from "lucide-react";
import type { Tone } from "./causes";

export type SiteEvent = {
  slug: string;
  title: string;
  /** ISO date, e.g. "2027-10-02" */
  date: string;
  endDate?: string;
  time?: string;
  venue: string;
  description: string;
  registrationUrl?: string;
};

/**
 * Upcoming events. Add real events here; the Events and Home pages show them automatically.
 * Keep the list in date order. Remove events once they're over (or move them to pastEvents).
 */
export const upcomingEvents: SiteEvent[] = [];

export const pastEvents: SiteEvent[] = [];

/** What the foundation organises regularly (from the MOA objects). */
export const eventTypes: { title: string; text: string; icon: LucideIcon; tone: Tone }[] = [
  {
    title: "Ram Leela",
    text: "Community Ram Leela performances during Navratri and Dussehra, bringing families and neighbourhoods together.",
    icon: Flame,
    tone: "orange",
  },
  {
    title: "Festivals & spiritual gatherings",
    text: "Diwali, Holi, Navratri and other celebrations, satsangs and devotional programmes, open to every family.",
    icon: Drum,
    tone: "amber",
  },
  {
    title: "Health camps",
    text: "Free check-ups, basic diagnostics and health awareness for people who can't easily reach a doctor.",
    icon: HeartPulse,
    tone: "rose",
  },
  {
    title: "Workshops & seminars",
    text: "Awareness programmes on education, health, hygiene, women's empowerment and more.",
    icon: Megaphone,
    tone: "brand",
  },
];
