import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DonateBand } from "@/components/sections/cta";
import { Artwork } from "@/components/ui/artwork";
import { Container } from "@/components/ui/layout";
import { JsonLd } from "@/components/ui/misc";
import { getCause } from "@/content/causes";
import { site } from "@/content/site";
import { getStory, stories, type StoryBlock } from "@/content/stories";
import { formatDate } from "@/lib/utils";

export function generateStaticParams() {
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) return {};
  return {
    title: story.title,
    description: story.excerpt,
    alternates: { canonical: `/stories/${story.slug}` },
    openGraph: { type: "article", title: story.title, description: story.excerpt, publishedTime: story.date },
  };
}

function Block({ block }: { block: StoryBlock }) {
  switch (block.type) {
    case "h2":
      return <h2>{block.text}</h2>;
    case "ul":
      return (
        <ul>
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="rounded-2xl border-l-4 border-sun-400 bg-white p-6 font-serif text-2xl italic text-brand-900">
          “{block.text}”{block.by && <footer className="mt-3 font-sans text-base not-italic text-muted">— {block.by}</footer>}
        </blockquote>
      );
    default:
      return <p>{block.text}</p>;
  }
}

export default async function StoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const story = getStory(slug);
  if (!story) notFound();
  const cause = story.cause ? getCause(story.cause) : undefined;

  return (
    <>
      <article className="bg-mesh-warm pb-[clamp(3rem,2rem+3vw,6rem)] pt-[clamp(2.5rem,1.5rem+3vw,5rem)]">
        <Container className="max-w-[60rem]">
          <Link href="/stories" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
            <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" aria-hidden="true" /> All stories
          </Link>
          <p className="mt-8 text-sm font-medium text-ember-600" data-reveal="fade">
            <time dateTime={story.date}>{formatDate(story.date)}</time> · {story.author}
          </p>
          <h1 className="text-display mt-3 font-display font-semibold text-brand-900 text-balance" data-reveal="blur">
            {story.title}
          </h1>
          <p className="text-lead mt-5 text-muted" data-reveal>
            {story.excerpt}
          </p>
          <div data-reveal="scale">
            <Artwork tone={cause?.tone ?? "brand"} icon={cause?.icon} iconPosition="center" className="mt-10 aspect-[16/8]" variant={1} />
          </div>
          <div className="prose-jsf mt-10">
            {story.body.map((b, i) => (
              <Block key={i} block={b} />
            ))}
          </div>
        </Container>
      </article>
      <DonateBand />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: story.title,
          description: story.excerpt,
          datePublished: story.date,
          author: { "@type": "Organization", name: story.author },
          publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: `${site.url}/icon.svg` } },
          mainEntityOfPage: `${site.url}/stories/${story.slug}`,
        }}
      />
    </>
  );
}
