import type { Metadata } from "next";
import { StoryCard } from "@/components/sections/cards";
import { NewsletterBand } from "@/components/sections/cta";
import { PageHero } from "@/components/sections/page-hero";
import { Accent, Section } from "@/components/ui/layout";
import { stories } from "@/content/stories";

export const metadata: Metadata = {
  title: "Stories & Updates",
  description: "News, stories of change and updates from Jeevansphere Foundation's work in education, healthcare and communities.",
  alternates: { canonical: "/stories" },
};

export default function StoriesPage() {
  const [first, ...rest] = stories;
  return (
    <>
      <PageHero
        title={
          <>
            News from <Accent light>Jeevansphere</Accent>
          </>
        }
        description="What we're doing, who we're meeting, and what your support makes possible."
        crumbs={[{ label: "Stories" }]}
      />
      <Section>
        <div className="grid gap-5">
          {first && <StoryCard story={first} featured />}
          {rest.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {rest.map((s, i) => (
                <StoryCard key={s.slug} story={s} index={i} />
              ))}
            </div>
          )}
        </div>
      </Section>
      <NewsletterBand />
    </>
  );
}
