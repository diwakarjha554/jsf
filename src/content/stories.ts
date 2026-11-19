import type { CauseSlug } from "./causes";

export type StoryBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string; by?: string };

export type Story = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date */
  date: string;
  author: string;
  cause?: CauseSlug;
  /** Path under /public. A patterned illustration is shown if empty. */
  image?: string;
  body: StoryBlock[];
};

/**
 * Stories and updates. Newest first. Two posts a month is a good pace for search traffic.
 * Only publish real stories, with consent from the people in them.
 */
export const stories: Story[] = [
  {
    slug: "introducing-jeevansphere-foundation",
    title: "Introducing Jeevansphere Foundation",
    excerpt:
      "A new Delhi-based non-profit for education, healthcare, social welfare, community development and India's cultural heritage.",
    date: "2026-11-15",
    author: "Jeevansphere Foundation",
    body: [
      {
        type: "p",
        text: "Jeevansphere Foundation is a newly registered not-for-profit company under Section 8 of the Companies Act, 2013, with its registered office in Delhi. Our founders came together with one belief: every life deserves a fair start, good health and a community that cares.",
      },
      { type: "h2", text: "What we will work on" },
      {
        type: "ul",
        items: [
          "Education and skills: from primary school to vocational training and digital literacy, with a focus on marginalised and economically disadvantaged families.",
          "Healthcare and wellness: affordable care, health camps and awareness of hygiene, nutrition, sanitation and mental health.",
          "Social welfare: poverty relief, livelihoods, women's empowerment, child welfare and care for senior citizens.",
          "Culture and heritage: Ram Leela, festivals, spiritual gatherings and devotional programmes.",
          "Community development: food security, water, sanitation, environment and renewable energy.",
        ],
      },
      { type: "h2", text: "How we work" },
      {
        type: "p",
        text: "As a Section 8 company, every rupee of our income is used only for these objectives. Nothing is paid out to members as profit, and our accounts are audited every year. We'll publish what we do and what it costs on our Transparency page as we grow.",
      },
      { type: "h2", text: "How you can be part of it" },
      {
        type: "p",
        text: "You can donate by UPI in under a minute, volunteer your time and skills, or partner with us as a school, hospital, company or NGO. Subscribe to our updates to hear about our first programmes and events.",
      },
    ],
  },
];

export function getStory(slug: string) {
  return stories.find((s) => s.slug === slug);
}
