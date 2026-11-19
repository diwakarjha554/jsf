import {
  Flame,
  GraduationCap,
  HandHeart,
  HeartPulse,
  Sparkles,
  Sprout,
  type LucideIcon,
} from "lucide-react";

export type Tone = "brand" | "rose" | "amber" | "orange" | "emerald" | "violet";

export const CAUSE_SLUGS = [
  "education",
  "healthcare",
  "social-welfare",
  "culture-heritage",
  "community-development",
] as const;
export type CauseSlug = (typeof CAUSE_SLUGS)[number];

export const DONATION_CAUSES = ["general", ...CAUSE_SLUGS] as const;
export type DonationCause = (typeof DONATION_CAUSES)[number];

export type Cause = {
  slug: CauseSlug;
  title: string;
  shortTitle: string;
  icon: LucideIcon;
  tone: Tone;
  tagline: string;
  summary: string;
  need: string;
  whatWeDo: string[];
  programmes: { title: string; text: string }[];
  moa: string;
  metaTitle: string;
  metaDescription: string;
  /**
   * DRAFT impact lines shown under each preset amount on /donate.
   * The foundation must approve every line (real costs) before launch.
   */
  impact: Record<number, string>;
};

export const causes: Cause[] = [
  {
    slug: "education",
    title: "Education & Skills",
    shortTitle: "Education",
    icon: GraduationCap,
    tone: "brand",
    tagline: "Quality learning, from first classroom to first job.",
    summary:
      "We support children and young people from marginalised and economically disadvantaged families with schooling, study material, digital literacy and skills for work.",
    need:
      "Too many children in India leave school early or finish without the skills they need, often because their families cannot afford books, devices, transport or a safe place to study. Young people who miss out on education find fewer routes into decent work.",
    whatWeDo: [
      "Scholarships, books, stationery and digital devices for students who need them",
      "Digital literacy and learning centres, libraries and after-school support",
      "Vocational training and skill development for young people",
      "Mid-day meals and transport support so children can stay in school",
      "Teacher training and curriculum development with partner schools",
      "Educational and career guidance and counselling",
    ],
    programmes: [
      { title: "Learning support", text: "After-school classes and study material for children from low-income families." },
      { title: "Digital literacy", text: "Basic computer and internet skills for students and young adults." },
      { title: "Skills for work", text: "Vocational courses and counselling that lead to jobs and self-employment." },
    ],
    moa: "MOA clause 3(a), objects 1–3",
    metaTitle: "Donate for Child Education in Delhi & India",
    metaDescription:
      "Support quality education, scholarships, digital literacy and skill training for children and young people from disadvantaged families. Donate by UPI to Jeevansphere Foundation.",
    impact: {
      501: "Can provide notebooks and stationery for a child for a term",
      1100: "Can provide a school kit with bag, books and supplies",
      2100: "Can support a month of digital literacy classes for a child",
      5100: "Can support a child's learning materials and fees for a term",
      11000: "Can support a child's education for a full year",
    },
  },
  {
    slug: "healthcare",
    title: "Healthcare & Wellness",
    shortTitle: "Healthcare",
    icon: HeartPulse,
    tone: "rose",
    tagline: "Affordable care and the knowledge to stay well.",
    summary:
      "We work to make quality medical care affordable and to spread awareness of hygiene, nutrition, sanitation, mental health and preventive care.",
    need:
      "For families on low incomes, a single illness can mean lost wages, debt or going without treatment. Simple prevention, early check-ups and awareness can stop many health problems before they become serious.",
    whatWeDo: [
      "Health camps, check-ups and diagnostic support for people who can't afford them",
      "Support for clinics, dispensaries and diagnostic centres",
      "Awareness workshops on hygiene, nutrition and sanitation",
      "Mental-health awareness and preventive healthcare campaigns",
    ],
    programmes: [
      { title: "Community health camps", text: "Free check-ups, basic tests and referrals in underserved neighbourhoods." },
      { title: "Health awareness", text: "Workshops on nutrition, hygiene, sanitation and mental health." },
    ],
    moa: "MOA clause 3(a), object 5",
    metaTitle: "Healthcare NGO in Delhi: Health Camps & Awareness",
    metaDescription:
      "Help make healthcare affordable: health camps, diagnostics, and awareness on hygiene, nutrition, sanitation and mental health. Donate by UPI to Jeevansphere Foundation.",
    impact: {
      501: "Can provide a basic medicine and first-aid kit for a family",
      1100: "Can fund health check-ups for five people at a camp",
      2100: "Can provide hygiene and sanitation kits for ten families",
      5100: "Can cover diagnostic tests for patients who can't afford them",
      11000: "Can help run a community health camp",
    },
  },
  {
    slug: "social-welfare",
    title: "Social Welfare",
    shortTitle: "Social welfare",
    icon: HandHeart,
    tone: "amber",
    tagline: "Dignity and support for families, women, children and elders.",
    summary:
      "We reach people who need it most through poverty relief, livelihood support, women's empowerment, child welfare and care for senior citizens.",
    need:
      "Poverty affects every part of life, from food and shelter to health and education. Women, children and older people are often the most affected and the least heard.",
    whatWeDo: [
      "Food, ration and essentials for families in need",
      "Livelihood generation and income support",
      "Women's empowerment through skills, awareness and self-help groups",
      "Child welfare and protection programmes",
      "Care and companionship for senior citizens",
      "Community mobilisation for lasting change",
    ],
    programmes: [
      { title: "Essentials support", text: "Ration kits, blankets and essentials for families going through hard times." },
      { title: "Women's livelihoods", text: "Skills and support for women to earn and build savings." },
      { title: "Elder care", text: "Health support, company and dignity for older people living alone." },
    ],
    moa: "MOA clause 3(a), object 4",
    metaTitle: "Social Welfare NGO in Delhi: Poverty Relief, Women & Elders",
    metaDescription:
      "Support poverty relief, livelihoods, women's empowerment, child welfare and senior citizen care in India. Donate by UPI to Jeevansphere Foundation.",
    impact: {
      501: "Can contribute towards a dry-ration kit for a family",
      1100: "Can provide a dry-ration kit for a family",
      2100: "Can provide blankets and warm clothes for five people",
      5100: "Can support livelihood training for a woman",
      11000: "Can support care for senior citizens for a month",
    },
  },
  {
    slug: "culture-heritage",
    title: "Culture & Heritage",
    shortTitle: "Culture",
    icon: Flame,
    tone: "orange",
    tagline: "Keeping our traditions alive, together.",
    summary:
      "We bring communities together through Ram Leela, festivals, spiritual gatherings and devotional programmes that celebrate India's living heritage.",
    need:
      "Shared celebrations hold communities together and pass values from one generation to the next. Many neighbourhoods lack the means to organise them, especially for families who can't afford to take part.",
    whatWeDo: [
      "Organising Ram Leela performances",
      "Community festival celebrations open to all",
      "Spiritual gatherings and devotional programmes",
      "Supporting local artists, performers and traditions",
    ],
    programmes: [
      { title: "Ram Leela", text: "Community Ram Leela performances that bring neighbourhoods together." },
      { title: "Festivals for all", text: "Celebrations of Diwali, Holi, Navratri and other festivals, open to every family." },
    ],
    moa: "MOA clause 3(a), object 4",
    metaTitle: "Ram Leela, Festivals & Cultural Programmes in Delhi",
    metaDescription:
      "Help keep India's traditions alive: Ram Leela, community festivals, spiritual gatherings and devotional programmes. Support Jeevansphere Foundation by UPI.",
    impact: {
      501: "Can provide diyas and puja materials for a community celebration",
      1100: "Can provide costumes and props for Ram Leela performers",
      2100: "Can provide prasad for a community gathering",
      5100: "Can cover sound and lighting for a cultural evening",
      11000: "Can sponsor a day of Ram Leela",
    },
  },
  {
    slug: "community-development",
    title: "Community Development",
    shortTitle: "Community",
    icon: Sprout,
    tone: "emerald",
    tagline: "Stronger, greener, more self-reliant communities.",
    summary:
      "We work on food security, clean water, environment, renewable energy, sanitation and livelihoods, so communities can thrive on their own terms.",
    need:
      "Hunger, poor sanitation, unsafe water and environmental damage hit the poorest communities hardest. Lasting change comes when communities have the resources and skills to solve problems themselves.",
    whatWeDo: [
      "Food security and nutrition initiatives",
      "Clean water, sanitation and slum development",
      "Tree plantation and environment protection",
      "Renewable energy and kitchen-garden projects",
      "Gender equality and livelihood programmes",
    ],
    programmes: [
      { title: "Green neighbourhoods", text: "Plantation drives and cleanliness campaigns with local residents." },
      { title: "Water & sanitation", text: "Safe drinking water and sanitation for underserved settlements." },
    ],
    moa: "MOA clause 3(b), item 1",
    metaTitle: "Community Development NGO: Water, Environment & Livelihoods",
    metaDescription:
      "Support food security, clean water, sanitation, environment and livelihoods in underserved communities. Donate by UPI to Jeevansphere Foundation.",
    impact: {
      501: "Can provide saplings for a community plantation drive",
      1100: "Can provide a water filter for a family",
      2100: "Can supply a neighbourhood cleanliness drive",
      5100: "Can provide kitchen-garden kits for ten families",
      11000: "Can provide a solar light set for a community space",
    },
  },
];

export const generalCause = {
  slug: "general" as const,
  title: "Where it's needed most",
  shortTitle: "Most needed",
  icon: Sparkles,
  tone: "violet" as Tone,
  tagline: "Let us direct your gift to the most urgent need.",
};

export function getCause(slug: string) {
  return causes.find((c) => c.slug === slug);
}

export function donationCauseLabel(slug: string) {
  if (slug === "general") return generalCause.title;
  return getCause(slug)?.title ?? slug;
}

export function isDonationCause(value: string | null | undefined): value is DonationCause {
  return !!value && (DONATION_CAUSES as readonly string[]).includes(value);
}
