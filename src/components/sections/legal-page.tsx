import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { Container } from "../ui/layout";
import { PageHero } from "./page-hero";

export function LegalPage({ title, updated, children }: { title: string; updated: string; children: ReactNode }) {
  return (
    <>
      <PageHero title={title} crumbs={[{ label: title }]} description={`Last updated: ${updated}`} />
      <section className="bg-cream py-[clamp(3rem,2rem+3vw,6rem)]">
        <Container className="max-w-[56rem]">
          <p className="mb-10 flex items-start gap-3 rounded-2xl border border-sun-300 bg-sun-50 p-4 text-sm text-sun-900">
            <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Draft for review by the foundation and its advisers before launch.
          </p>
          <div className="prose-jsf">{children}</div>
        </Container>
      </section>
    </>
  );
}
